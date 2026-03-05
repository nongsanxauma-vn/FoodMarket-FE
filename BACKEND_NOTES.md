# Backend Notes - Order Status Update Issue

## Tổng Quan Vấn Đề

Khi shop owner cập nhật trạng thái đơn hàng, hệ thống báo lỗi:
```
JSON parse error: Cannot deserialize value of type...ERED, PENDING, PAID, FAILED, SHIPPING, CONFIRMED
```

Có **2 vấn đề** cần giải quyết:

---

## VẤN ĐỀ 1: Frontend gửi status không hợp lệ (ĐÃ SỬA)

**Nguyên nhân**: 
- File `OrderPreparation.tsx` đang gửi `{ status: 'PREPARING' }`
- Status `'PREPARING'` KHÔNG TỒN TẠI trong Backend enum `OrderStatus`

**Hậu quả**:
- Backend Jackson deserializer không thể convert string `'PREPARING'` thành enum
- Throw JSON parse error và liệt kê tất cả các giá trị hợp lệ trong message

**Đã sửa**: Thay `'PREPARING'` bằng `'SHIPPING'`

**Valid OrderStatus values** (from `OrderStatus.java`):
- PENDING
- CONFIRMED
- SHIPPING
- DELIVERED
- CANCELLED
- PAID
- FAILED

## Frontend Changes Made
1. Fixed `OrderPreparation.tsx` - removed invalid `'PREPARING'` status
2. Implemented workaround in `Orders.tsx` - changed PENDING → SHIPPING directly (skipping CONFIRMED)
3. Updated `OrderPreparation.tsx` - removed redundant status update, just shows preparation UI
4. Added console logging to track requests in:
   - `order.service.ts`
   - `Orders.tsx`
   - `OrderPreparation.tsx`
   - `http.client.ts`

## Current Order Flow (with workaround)
1. Buyer creates order → **PENDING**
2. Shop owner confirms → **SHIPPING** (skips CONFIRMED due to Backend bug)
3. Shop owner uses OrderPreparation page → stays **SHIPPING** (just UI for preparation)
4. Buyer receives → **DELIVERED** (buyer marks as received)

## Ideal Order Flow (after Backend fix)
1. Buyer creates order → **PENDING**
2. Shop owner confirms → **CONFIRMED**
3. Shop owner ships → **SHIPPING**
4. Buyer receives → **DELIVERED**

---

## VẤN ĐỀ 2: Backend validation logic SAI - CRITICAL ⚠️
### Vị trí lỗi
File: `FoodMarket_BE/src/main/java/com/swd301/foodmarket/service/impl/OrderServiceImpl.java`  
Dòng: 159-161

### Code hiện tại (SAI)
```java
@Override
public OrderResponse updateOrder(Integer id, OrderUpdateRequest request) {
    Order order = orderRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

    // ❌ LOGIC SAI - Chặn cập nhật đơn hàng đã CONFIRMED
    if (order.getStatus() == OrderStatus.CONFIRMED || 
        order.getStatus() == OrderStatus.CANCELLED) {
        throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
    }

    if (request.getStatus() != null) {
        order.setStatus(request.getStatus());
    }

    Order savedOrder = orderRepository.save(order);
    // ... rest of code
}
```

### Tại sao đây là BUG nghiêm trọng?

**Kịch bản bị phá vỡ:**

1. **Bước 1**: Buyer tạo đơn hàng
   - Status: `PENDING` ✅

2. **Bước 2**: Shop owner xác nhận đơn hàng
   - Frontend gửi: `PATCH /orders/123 { "status": "CONFIRMED" }`
   - Backend cập nhật: `PENDING` → `CONFIRMED` ✅
   - Status hiện tại: `CONFIRMED`

3. **Bước 3**: Shop owner chuẩn bị xong, bấm "Giao hàng"
   - Frontend gửi: `PATCH /orders/123 { "status": "SHIPPING" }`
   - Backend kiểm tra: `if (order.getStatus() == OrderStatus.CONFIRMED)` → **TRUE**
   - Backend throw exception: `INVALID_ORDER_STATUS` ❌
   - **ĐƠN HÀNG BỊ KẸT, KHÔNG THỂ CHUYỂN SANG SHIPPING**

4. **Kết quả**: 
   - Đơn hàng mãi mãi ở trạng thái `CONFIRMED`
   - Không thể chuyển sang `SHIPPING` hoặc `DELIVERED`
   - Shop owner không thể hoàn thành quy trình giao hàng

### Tại sao logic này sai?

Backend đang nghĩ:
> "Đơn hàng đã CONFIRMED thì không được sửa nữa"

Nhưng thực tế:
> "Đơn hàng CONFIRMED là bước giữa, cần chuyển tiếp sang SHIPPING → DELIVERED"

**Luồng đúng phải là:**
```
PENDING → CONFIRMED → SHIPPING → DELIVERED
   ↓
CANCELLED (có thể hủy ở bất kỳ bước nào trước DELIVERED)
```

### Giải pháp Backend cần làm

#### Option 1: Chỉ chặn CANCELLED và DELIVERED (Đơn giản nhất)
```java
@Override
public OrderResponse updateOrder(Integer id, OrderUpdateRequest request) {
    Order order = orderRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

    // ✅ Chỉ chặn các trạng thái kết thúc
    if (order.getStatus() == OrderStatus.CANCELLED || 
        order.getStatus() == OrderStatus.DELIVERED) {
        throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
    }

    if (request.getStatus() != null) {
        order.setStatus(request.getStatus());
    }

    Order savedOrder = orderRepository.save(order);
    // ... rest of code
}
```

#### Option 2: Validate chuyển đổi trạng thái hợp lệ (Tốt nhất)
```java
@Override
public OrderResponse updateOrder(Integer id, OrderUpdateRequest request) {
    Order order = orderRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

    OrderStatus currentStatus = order.getStatus();
    OrderStatus newStatus = request.getStatus();

    // ✅ Validate các chuyển đổi hợp lệ
    if (!isValidStatusTransition(currentStatus, newStatus)) {
        throw new AppException(ErrorCode.INVALID_ORDER_STATUS_TRANSITION);
    }

    order.setStatus(newStatus);
    Order savedOrder = orderRepository.save(order);
    // ... rest of code
}

private boolean isValidStatusTransition(OrderStatus from, OrderStatus to) {
    // Không thể thay đổi đơn hàng đã kết thúc
    if (from == OrderStatus.CANCELLED || from == OrderStatus.DELIVERED) {
        return false;
    }

    // Các chuyển đổi hợp lệ
    switch (from) {
        case PENDING:
            return to == OrderStatus.CONFIRMED || 
                   to == OrderStatus.SHIPPING || 
                   to == OrderStatus.CANCELLED;
        
        case CONFIRMED:
            return to == OrderStatus.SHIPPING || 
                   to == OrderStatus.CANCELLED;
        
        case SHIPPING:
            return to == OrderStatus.DELIVERED || 
                   to == OrderStatus.CANCELLED;
        
        case PAID:
            return to == OrderStatus.CONFIRMED || 
                   to == OrderStatus.SHIPPING;
        
        default:
            return false;
    }
}
```

#### Option 3: Sử dụng State Machine Pattern (Professional)
```java
// Tạo enum với allowed transitions
public enum OrderStatus {
    PENDING(Set.of(CONFIRMED, SHIPPING, CANCELLED)),
    CONFIRMED(Set.of(SHIPPING, CANCELLED)),
    SHIPPING(Set.of(DELIVERED, CANCELLED)),
    DELIVERED(Set.of()),
    CANCELLED(Set.of()),
    PAID(Set.of(CONFIRMED, SHIPPING)),
    FAILED(Set.of());

    private final Set<OrderStatus> allowedTransitions;

    OrderStatus(Set<OrderStatus> allowedTransitions) {
        this.allowedTransitions = allowedTransitions;
    }

    public boolean canTransitionTo(OrderStatus newStatus) {
        return allowedTransitions.contains(newStatus);
    }
}

// Trong OrderServiceImpl
if (!currentStatus.canTransitionTo(newStatus)) {
    throw new AppException(ErrorCode.INVALID_ORDER_STATUS_TRANSITION);
}
```

### Workaround tạm thời ở Frontend (ĐÃ IMPLEMENT)

Vì Backend chưa sửa, Frontend đang bỏ qua bước `CONFIRMED`:

```
PENDING → SHIPPING → DELIVERED
   ↓
CANCELLED
```

**Code Frontend:**
```typescript
// Orders.tsx - Khi shop owner bấm "Chuẩn bị hàng"
const handleConfirmOrder = async (orderId: number) => {
  // Thay vì gửi CONFIRMED, gửi luôn SHIPPING
  const updateData = { status: 'SHIPPING' };
  await orderService.updateOrder(orderId, updateData);
}
```

**Hạn chế của workaround:**
- Mất đi trạng thái `CONFIRMED` để tracking
- Không phân biệt được "đã xác nhận" vs "đang giao"
- Không theo đúng business logic

---

## Chi Tiết Kỹ Thuật

### Request Format
Frontend gửi:
```json
{
  "status": "CONFIRMED"
}
```

Backend nhận qua `OrderUpdateRequest`:
```java
@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderUpdateRequest {
    OrderStatus status;  // Enum type
}
```

### Jackson Deserialization
- Jackson tự động convert string → enum
- String `"CONFIRMED"` → `OrderStatus.CONFIRMED`
- Nếu string không match enum value → JSON parse error
- Error message sẽ liệt kê tất cả enum values

### Debugging
Đã thêm logging ở Frontend:
- `http.client.ts`: Log request URL, headers, body
- `order.service.ts`: Log method calls
- `Orders.tsx`: Log update requests
- `OrderPreparation.tsx`: Log preparation flow

Để debug, mở Console trong browser và xem logs khi cập nhật đơn hàng.

---

## Tóm Tắt Cho Backend Team

### Cần sửa NGAY
1. ✅ **Vấn đề 1 đã được Frontend fix**: Không còn gửi `'PREPARING'`
2. ❌ **Vấn đề 2 CẦN Backend sửa**: Logic validation ở `OrderServiceImpl.java` line 159-161

### Action Items
- [ ] Xóa hoặc sửa validation `if (order.getStatus() == OrderStatus.CONFIRMED)`
- [ ] Implement proper status transition validation
- [ ] Test flow: PENDING → CONFIRMED → SHIPPING → DELIVERED
- [ ] Đảm bảo chỉ CANCELLED và DELIVERED là final states

### Priority
🔴 **HIGH** - Đang block toàn bộ order flow, Frontend đang dùng workaround không tối ưu
