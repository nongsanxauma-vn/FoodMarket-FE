# Debug Image Upload - Failed to Fetch

## Lỗi
```
TypeError: Failed to fetch
```

## Đã sửa
✅ Sửa field name: `'upload'` → `'file'`
✅ Sửa URL: hardcode → dùng `API_BASE_URL`
✅ Thêm logging chi tiết

## Kiểm tra Backend

### 1. Backend có đang chạy không?
Mở terminal và check:
```bash
# Windows
netstat -ano | findstr :8080

# Hoặc thử curl
curl http://localhost:8080/api/v1/blogs
```

Nếu không có response → Backend KHÔNG chạy → Cần start Backend

### 2. Start Backend
```bash
cd FoodMarket_BE
mvnw spring-boot:run

# Hoặc
./mvnw spring-boot:run
```

### 3. Kiểm tra endpoint
Sau khi Backend chạy, test endpoint:
```bash
curl -X POST http://localhost:8080/api/v1/blogs/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@path/to/image.jpg"
```

### 4. Kiểm tra Console logs
Khi upload ảnh, mở Console (F12) và xem:
```
[MyCKEditor] Uploading image: example.jpg
[MyCKEditor] Upload URL: http://localhost:8080/api/v1/blogs/upload-image
[MyCKEditor] Token: Present
[MyCKEditor] Upload response status: 200
[MyCKEditor] Upload response data: { url: "..." }
```

## Các trường hợp lỗi

### Case 1: Failed to fetch
**Nguyên nhân**: Backend không chạy hoặc sai URL
**Giải pháp**: 
1. Start Backend
2. Kiểm tra URL trong Console log
3. Verify `API_BASE_URL` trong `api.config.ts`

### Case 2: 401 Unauthorized
**Nguyên nhân**: Token hết hạn hoặc không hợp lệ
**Giải pháp**: 
1. Logout và login lại
2. Kiểm tra token trong localStorage

### Case 3: 400 Bad Request
**Nguyên nhân**: Sai format request
**Giải pháp**: 
1. Kiểm tra field name phải là `'file'`
2. Kiểm tra file có phải image không

### Case 4: 500 Internal Server Error
**Nguyên nhân**: Backend lỗi (Cloudinary config, etc.)
**Giải pháp**: 
1. Kiểm tra Backend logs
2. Verify Cloudinary credentials trong `.env`

## URL đúng

Frontend: `http://localhost:3000` (hoặc port khác)
Backend: `http://localhost:8080/api/v1`
Upload endpoint: `http://localhost:8080/api/v1/blogs/upload-image`

## Checklist

- [ ] Backend đang chạy trên port 8080
- [ ] Endpoint `/api/v1/blogs/upload-image` tồn tại
- [ ] CORS đã được config
- [ ] Cloudinary credentials đúng trong `.env`
- [ ] Token hợp lệ (chưa hết hạn)
- [ ] Field name là `'file'` (không phải `'upload'`)
- [ ] File là image (jpg, png, gif, etc.)

## Test nhanh

1. Mở Console (F12)
2. Chạy command:
```javascript
fetch('http://localhost:8080/api/v1/blogs', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
  }
})
.then(r => r.json())
.then(d => console.log('Backend OK:', d))
.catch(e => console.error('Backend ERROR:', e))
```

Nếu thấy "Backend OK" → Backend đang chạy
Nếu thấy "Backend ERROR: Failed to fetch" → Backend KHÔNG chạy
