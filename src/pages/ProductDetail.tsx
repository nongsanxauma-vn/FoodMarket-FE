import { useEffect, useState } from 'react';
import { productService, ProductResponse, userService, UserResponse } from '../services';
import {
   Star,
   MapPin,
   ShoppingCart,
   ChevronRight,
   Clock,
   Store,
   CheckCircle2,
   Plus,
   Minus,
   Quote,
   Camera,
   ArrowRight,
   AlertTriangle,
   Loader2
} from 'lucide-react';

interface ProductDetailProps {
   productId: string;
   onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack }) => {
   const [quantity, setQuantity] = useState(1);
   const [product, setProduct] = useState<ProductResponse | null>(null);
   const [shopOwner, setShopOwner] = useState<UserResponse | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            setIsLoading(true);
            const response = await productService.getById(Number(productId));
            if (response.result) {
               setProduct(response.result);
               if (response.result.shopOwnerId) {
                  try {
                     const ownerRes = await userService.getUserById(response.result.shopOwnerId);
                     if (ownerRes.result) setShopOwner(ownerRes.result);
                  } catch (e) {
                     console.error("Failed to load shop owner", e);
                  }
               }
            }
         } catch (err) {
            console.error('Failed to fetch product:', err);
            setError('Không thể tải thông tin sản phẩm.');
         } finally {
            setIsLoading(false);
         }
      };

      fetchProduct();
   }, [productId]);

   if (isLoading) {
      return (
         <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] gap-4">
            <Loader2 className="size-12 text-primary animate-spin" />
            <p className="text-gray-400 font-bold">Đang lấy thông tin sản phẩm...</p>
         </div>
      );
   }

   if (error || !product) {
      return (
         <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] gap-6 px-4 text-center">
            <div className="size-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
               <AlertTriangle className="size-10" />
            </div>
            <div className="max-w-md">
               <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase">Lỗi tải dữ liệu</h2>
               <p className="text-gray-500 font-medium">{error || 'Không tìm thấy sản phẩm này trong kho.'}</p>
            </div>
            <button onClick={onBack} className="bg-primary text-white font-black px-8 py-3 rounded-xl shadow-lg shadow-primary/20">Quay về trang chủ</button>
         </div>
      );
   }

   return (
      <div className="flex-1 bg-white animate-in fade-in duration-500 pb-32">
         {/* Breadcrumbs */}
         <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-6">
            <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <button onClick={onBack} className="hover:text-primary">Trang chủ</button>
               <ChevronRight className="size-3" />
               <span className="hover:text-primary cursor-pointer">Nông sản</span>
               <ChevronRight className="size-3" />
               <span className="text-gray-900">{product.productName}</span>
            </nav>
         </div>

         <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left: Images */}
            <div className="lg:col-span-5 flex flex-col gap-6">
               <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-lg border border-gray-100 group">
                  <img src={product.imageUrl || 'https://picsum.photos/seed/tomato_detail/800/800'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={product.productName} />
                  <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white border border-white/10">
                     <Camera className="size-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Ảnh thật từ vườn</span>
                  </div>
               </div>
               <div className="grid grid-cols-4 gap-4">
                  <div className="aspect-square rounded-2xl border-2 border-primary overflow-hidden p-1">
                     <div className="w-full h-full rounded-xl bg-green-50 flex items-center justify-center text-primary font-black text-xl">1</div>
                  </div>
                  <img src="https://picsum.photos/seed/t2/200/200" className="aspect-square rounded-2xl object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 cursor-pointer transition-all" alt="detail-1" />
                  <img src="https://picsum.photos/seed/t3/200/200" className="aspect-square rounded-2xl object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 cursor-pointer transition-all" alt="detail-2" />
                  <div className="aspect-square rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-black text-xs cursor-pointer hover:bg-gray-100 transition-colors">
                     +3 ảnh
                  </div>
               </div>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-7 flex flex-col gap-8">
               <div className="flex flex-col gap-2">
                  <h1 className="text-4xl font-black text-gray-900 font-display uppercase tracking-tight">{product.productName}</h1>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-1.5">
                        <Star className="size-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-black text-gray-900">4.9</span>
                        <span className="text-gray-400 text-xs font-bold ml-1">• Đã bán 120</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase">
                        <MapPin className="size-4 text-primary" /> Vườn nhà
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 flex flex-col gap-6">
                  <div className="flex items-baseline gap-4">
                     <span className="text-4xl font-black text-primary">{product.sellingPrice.toLocaleString('vi-VN')}đ</span>
                     <span className="text-lg font-bold text-gray-300 line-through">{(product.sellingPrice * 1.2).toLocaleString('vi-VN')}đ</span>
                     <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest ml-2">ƯU ĐÃI</span>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đơn vị tính: <span className="text-gray-900">{product.unit}</span></p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-center gap-4">
                     <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                        <AlertTriangle className="size-5" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">TÌNH TRẠNG KHO</p>
                        <p className="text-xs font-black text-orange-900 mt-0.5">{product.stockQuantity} {product.unit} sẵn có</p>
                     </div>
                  </div>
                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-center gap-4">
                     <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                        <Clock className="size-5" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">HẠN SỬ DỤNG</p>
                        <p className="text-xs font-black text-blue-900 mt-0.5">Tươi sạch nhất hôm nay</p>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-white border border-gray-100 rounded-[32px] flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                     <div className="size-14 bg-gray-100 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Store className="size-7" />
                     </div>
                     <div>
                        <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">{shopOwner?.shopName || shopOwner?.fullName || 'Nông Trại FoodMarket'}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{shopOwner?.address || 'Vùng canh tác hữu cơ'}</p>
                        <div className="flex items-center gap-4 mt-1">
                           <span className="text-[10px] font-black text-primary uppercase">98% Phản hồi</span>
                           <span className="text-[10px] font-bold text-gray-300">Uy tín cao</span>
                        </div>
                     </div>
                  </div>
                  <button className="px-6 py-3 border border-primary/20 text-primary text-xs font-black rounded-xl hover:bg-primary hover:text-white transition-all">Xem shop</button>
               </div>
            </div>
         </div>

         {/* Story Section */}
         <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-20">
            <div className="mb-10">
               <h2 className="text-3xl font-black text-gray-900 uppercase font-display">Mô tả sản phẩm</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
               <div className="lg:col-span-2 space-y-8 text-gray-600 font-medium leading-[1.8]">
                  <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>

                  <div className="p-10 bg-green-50/50 rounded-[40px] border-l-8 border-primary relative overflow-hidden">
                     <Quote className="absolute -top-4 -right-4 size-32 text-primary opacity-5" />
                     <p className="text-xl font-bold text-gray-800 italic relative z-10">
                        "Chúng tôi cam kết mang đến những sản phẩm nông sản mộc mạc nhất, giá trị thật nhất cho bữa cơm gia đình bạn."
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Sticky Bottom Bar */}
         <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-6 shadow-2xl z-[100] animate-in slide-in-from-bottom-full duration-700">
            <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 flex items-center justify-between gap-8">
               <div className="flex items-center gap-12">
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"><Minus className="size-4" /></button>
                     <span className="text-lg font-black text-gray-900 w-8 text-center">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="size-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"><Plus className="size-4" /></button>
                  </div>
                  <div className="flex flex-col">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">TẠM TÍNH</p>
                     <p className="text-2xl font-black text-gray-900">{(product.sellingPrice * quantity).toLocaleString('vi-VN')}đ</p>
                  </div>
               </div>
               <div className="flex gap-4 flex-1 max-w-md">
                  <button className="flex-1 py-4 px-8 border-2 border-primary text-primary font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/5 transition-all">
                     <ShoppingCart className="size-5" /> Thêm vào giỏ
                  </button>
                  <button className="flex-1 py-4 px-8 bg-primary text-white font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95">
                     Mua ngay
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProductDetail;
