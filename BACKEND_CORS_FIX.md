# Blog Image Upload - CORS Issue (ĐÃ SỬA)

## Lỗi gặp phải
```
Access to fetch at 'http://localhost:8080/swp391/blogs/upload-image' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

## Nguyên nhân
Frontend gửi sai tên field trong FormData:
- Frontend gửi: `formData.append('upload', file)` ❌
- Backend expect: `@RequestParam("file")` ✅

## Đã sửa ✅

### Frontend - MyCKEditor.tsx
```typescript
// Trước (SAI):
formData.append('upload', file);

// Sau (ĐÚNG):
formData.append('file', file);
```

## Backend đã có sẵn

### 1. CORS Configuration ✅
File: `SecurityConfig.java`
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(List.of("*"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

### 2. Upload Endpoint ✅
File: `BlogController.java`
```java
@CrossOrigin(origins = "http://localhost:3000")
@PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
        throw new RuntimeException("File is empty");
    }
    
    String imageUrl = cloudService.uploadImage(file);
    return Map.of("url", imageUrl);
}
```

### 3. Cloudinary Service ✅
Backend đang dùng Cloudinary để lưu ảnh, trả về URL public.

## Test

1. Vào trang "Viết bài mới"
2. Click nút "🖼️ Ảnh" hoặc paste ảnh (Ctrl+V)
3. Chọn file ảnh
4. Ảnh sẽ được upload lên Cloudinary
5. URL ảnh sẽ được insert vào editor

## Kết quả
✅ Upload ảnh thành công
✅ Ảnh được lưu trên Cloudinary
✅ URL ảnh được insert vào blog content
