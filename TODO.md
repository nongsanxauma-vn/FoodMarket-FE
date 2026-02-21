# Kế hoạch thực hiện tính năng "Tạo combo nấu ăn"

## Bước 1: Cập nhật types/index.ts
- Thêm interface Recipe để lưu thông tin món ăn
- Thêm interface Combo để lưu thông tin combo nấu ăn
- Cập nhật interface Product để có thể liên kết với recipes

## Bước 2: Cập nhật constants/index.ts
- Thêm dữ liệu mẫu về recipes/combos

## Bước 3: Cập nhật geminiService.ts
- Kích hoạt các hàm gợi ý món ăn (uncomment)

## Bước 4: Cập nhật ProductDetail.tsx
- Hiển thị gợi ý món ăn thực tế thay vì sản phẩm liên quan
- Sử dụng dữ liệu từ constants hoặc geminiService

## Bước 5: Cập nhật farmer/Products.tsx
- Thêm nút "Tạo combo nấu ăn" cho mỗi sản phẩm
- Tạo modal/form để farmer tạo combo

## Bước 6: Tạo component hiển thị RecipeCombo
- Tạo component tái sử dụng để hiển thị gợi ý món ăn
