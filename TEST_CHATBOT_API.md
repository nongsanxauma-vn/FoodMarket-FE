# Test ChatBot API

## 1. Kiểm tra Backend đang chạy

Mở browser và truy cập:
```
http://localhost:8080/api/v1
```

Nếu thấy response (JSON hoặc error page) → Backend đang chạy ✅
Nếu "This site can't be reached" → Backend chưa chạy ❌

## 2. Test ChatBot API bằng Postman/Thunder Client

### Test POST /chatbot/chat

**URL:** `http://localhost:8080/api/v1/chatbot/chat`

**Method:** POST

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Body:**
```json
{
  "message": "Xin chào",
  "context": {
    "userId": 1,
    "userRole": "BUYER"
  }
}
```

**Expected Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "message": "Xin chào! Tôi có thể giúp gì cho bạn?",
    "suggestions": ["Tìm sản phẩm", "Kiểm tra đơn hàng"],
    "actions": []
  }
}
```

### Test GET /chatbot/history

**URL:** `http://localhost:8080/api/v1/chatbot/history`

**Method:** GET

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

## 3. Kiểm tra lỗi trong Frontend

### Mở Chrome DevTools (F12)

1. **Tab Console** - Xem error logs
   - Tìm: `ChatBot sendMessage error`
   - Tìm: `Failed to fetch`
   - Tìm: `401`, `403`, `404`, `500`

2. **Tab Network** - Xem HTTP requests
   - Filter: `chatbot`
   - Xem Status Code:
     - 200 ✅ - Thành công
     - 401 ❌ - Chưa đăng nhập
     - 403 ❌ - Không có quyền
     - 404 ❌ - API không tồn tại
     - 500 ❌ - Lỗi server

3. **Tab Application** - Xem localStorage
   - Kiểm tra `auth_token` có tồn tại không
   - Copy token để test API

## 4. Các lỗi thường gặp

### Lỗi 1: "Failed to fetch" hoặc "Network Error"
**Nguyên nhân:** Backend chưa chạy hoặc CORS issue

**Giải pháp:**
- Start backend: `mvn spring-boot:run`
- Kiểm tra CORS config trong backend

### Lỗi 2: 401 Unauthorized
**Nguyên nhân:** Chưa đăng nhập hoặc token hết hạn

**Giải pháp:**
- Logout và login lại
- Kiểm tra token trong localStorage

### Lỗi 3: 404 Not Found
**Nguyên nhân:** API endpoint không tồn tại

**Giải pháp:**
- Kiểm tra backend có controller `/chatbot/chat` không
- Kiểm tra API_BASE_URL trong `api.config.ts`

### Lỗi 4: 500 Internal Server Error
**Nguyên nhân:** Lỗi trong backend code

**Giải pháp:**
- Xem backend console logs
- Kiểm tra database connection
- Kiểm tra AI service (OpenAI, Gemini) config

## 5. Debug Frontend

Thêm log vào `chatbot.service.ts`:

```typescript
async sendMessage(message: string, context?: ChatContext): Promise<ChatResponse> {
  console.log('=== ChatBot Debug ===');
  console.log('Message:', message);
  console.log('Context:', context);
  console.log('API URL:', API_BASE_URL + '/chatbot/chat');
  console.log('Token:', localStorage.getItem('auth_token'));
  
  // ... existing code
}
```

## 6. Kiểm tra Backend có API chưa

Xem backend code:
- File: `ChatBotController.java`
- Endpoint: `@PostMapping("/chatbot/chat")`
- Service: `ChatBotService.java`

Nếu chưa có → Yêu cầu backend team implement
