import React, { useState } from 'react';
import { CheckCircle, Search, Filter, MoreVertical, Eye, Trash2, Check, X, ArrowLeft, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  farmer: string;
  farmerId: string;
  image: string;
  farmerImage: string;
  category: string;
  price: string;
  stock: string;
  date: string;
  status: string;
  color: string;
  description?: string;
  expiry?: string;
  unit?: string;
  origin?: string;
}

const ProductApproval: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { 
      id: 'SP-88912', 
      name: 'Cam hữu cơ Đà Lạt', 
      farmer: 'Nguyễn Văn An',
      farmerId: 'ND-88912',
      image: 'https://picsum.photos/seed/1/200/200',
      farmerImage: 'https://picsum.photos/seed/k1/80/80',
      category: 'Rau quả tươi',
      price: '45,000đ/kg',
      stock: '150kg',
      date: '14/10/2023 09:30',
      status: 'CHỜ DUYỆT',
      color: 'text-blue-600',
      description: 'Cam hữu cơ được canh tác theo tiêu chuẩn nghiêm ngặt, đảm bảo độ tươi ngon và an toàn tuyệt đối cho sức khỏe gia đình bạn. Không sử dụng hóa chất bảo vệ thực vật có hại.',
      expiry: '20/10/2023',
      unit: 'kg',
      origin: 'Lâm Đồng, Đà Lạt'
    },
    { 
      id: 'SP-22105', 
      name: 'Xà lách xoăn Đà Lạt',
      farmer: 'Trần Thị Bé',
      farmerId: 'ND-22105',
      image: 'https://picsum.photos/seed/2/200/200',
      farmerImage: 'https://picsum.photos/seed/k2/80/80',
      category: 'Rau ăn lá',
      price: '25,000đ/kg',
      stock: '200kg',
      date: '14/10/2023 08:15',
      status: 'ĐANG XEM XÉT',
      color: 'text-orange-500',
      description: 'Xà lách xoăn tươi, màu sắc xanh tự nhiên, không bị héo. Được trồng trên nền đất giàu dinh dưỡng và tưới nước sạch theo tiêu chuẩn hữu cơ.',
      expiry: '16/10/2023',
      unit: 'kg',
      origin: 'Lâm Đồng, Đà Lạt'
    },
    { 
      id: 'SP-00122', 
      name: 'Cà phê Tây Nguyên',
      farmer: 'Lê Hoàng Nam',
      farmerId: 'ND-00122',
      image: 'https://picsum.photos/seed/3/200/200',
      farmerImage: 'https://picsum.photos/seed/k3/80/80',
      category: 'Cà phê hạt',
      price: '85,000đ/kg',
      stock: '500kg',
      date: '13/10/2023 16:45',
      status: 'CHỜ DUYỆT',
      color: 'text-blue-600',
      description: 'Cà phê Arabica chọn lọc từ Tây Nguyên, hương vị đắng nhẹ với vị ngọt tự nhiên. Được chứng nhận hữu cơ và bền vững.',
      expiry: '13/04/2024',
      unit: 'kg',
      origin: 'Đắk Lắk, Tây Nguyên'
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingProductId, setRejectingProductId] = useState<string | null>(null);

  const handleApprove = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: 'ĐÃ DUYỆT', color: 'text-emerald-600' } : p
    ));
    setSelectedProduct(null);
  };

  const handleRejectClick = (productId: string) => {
    setRejectingProductId(productId);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    
    if (rejectingProductId) {
      setProducts(products.map(p => 
        p.id === rejectingProductId ? { ...p, status: 'BỊ TỪ CHỐI', color: 'text-red-600' } : p
      ));
    }
    
    setShowRejectModal(false);
    setRejectReason('');
    setRejectingProductId(null);
    setSelectedProduct(null);
  };

  // Nếu có sản phẩm được chọn, hiển thị modal chi tiết
  if (selectedProduct) {
    return (
      <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="size-11 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h2 className="text-3xl font-black font-display text-gray-900">Chi Tiết Sản Phẩm</h2>
            <p className="text-gray-400 font-medium text-sm mt-1">Duyệt hoặc từ chối sản phẩm này</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hình ảnh sản phẩm */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden p-8">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-auto rounded-2xl object-cover mb-6" />
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">ID SẢN PHẨM</p>
                  <p className="text-sm font-bold text-gray-900">{selectedProduct.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">DANH MỤC</p>
                  <p className="text-sm font-bold text-gray-900">{selectedProduct.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Thông tin cơ bản */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Thông Tin Sản Phẩm</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tên sản phẩm</label>
                  <p className="text-lg font-black text-gray-900">{selectedProduct.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Giá bán</label>
                    <p className="text-lg font-black text-orange-600">{selectedProduct.price}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tồn kho</label>
                    <p className="text-lg font-black text-gray-900">{selectedProduct.stock}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Mô tả sản phẩm</label>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nguồn gốc</label>
                    <p className="text-sm font-bold text-gray-900">{selectedProduct.origin}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Hạn sử dụng</label>
                    <p className="text-sm font-bold text-gray-900">{selectedProduct.expiry}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Đơn vị</label>
                    <p className="text-sm font-bold text-gray-900">{selectedProduct.unit}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin nông dân */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Thông Tin Nông Dân</h3>
              <div className="flex items-center gap-6">
                <img src={selectedProduct.farmerImage} alt={selectedProduct.farmer} className="size-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-black text-gray-900">{selectedProduct.farmer}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedProduct.farmerId}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full">KYC APPROVED</span>
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Quyết Định</h3>
                  <p className="text-sm text-gray-400 mt-1">Duyệt hoặc từ chối sản phẩm này</p>
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${selectedProduct.color === 'text-emerald-600' ? 'bg-emerald-50 text-emerald-600' : selectedProduct.color === 'text-red-600' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  {selectedProduct.status}
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleApprove(selectedProduct.id)}
                  className="flex-1 px-6 py-4 bg-emerald-50 text-emerald-600 text-sm font-black rounded-2xl uppercase tracking-widest hover:bg-emerald-100 transition-colors flex items-center justify-center gap-3 border border-emerald-200"
                >
                  <Check className="size-5" /> Duyệt Sản Phẩm
                </button>
                <button 
                  onClick={() => handleRejectClick(selectedProduct.id)}
                  className="flex-1 px-6 py-4 bg-red-50 text-red-600 text-sm font-black rounded-2xl uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-3 border border-red-200"
                >
                  <X className="size-5" /> Từ Chối
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị danh sách sản phẩm

  return (
    <>
      {/* Modal Từ Chối */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Nhập Lý Do Từ Chối</h3>
              <p className="text-sm text-gray-400">Vui lòng cung cấp lý do chi tiết để gửi thông báo cho nông dân</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-black text-gray-700 mb-3 block">Lý do từ chối</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Ảnh sản phẩm không rõ ràng, thiếu thông tin chi tiết..."
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all resize-none"
                  rows={5}
                />
                <p className="text-[10px] text-gray-400 mt-2 font-medium">{rejectReason.length}/500 ký tự</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <button
                  onClick={confirmReject}
                  className="w-full px-6 py-4 bg-red-600 text-white text-sm font-black rounded-2xl uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-3"
                >
                  <X className="size-5" /> Xác Nhận Từ Chối
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setRejectingProductId(null);
                  }}
                  className="w-full px-6 py-4 bg-gray-50 text-gray-600 text-sm font-black rounded-2xl uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Duyệt Sản Phẩm Nông Dân</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Quản lý và phê duyệt các sản phẩm mà nông dân đăng lên hệ thống XẤU MÃ.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4 pr-10">
              <div className="size-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                 <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CHỜ DUYỆT</p>
                 <h4 className="text-xl font-black text-gray-900">28</h4>
              </div>
           </div>
           <div className="bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4 pr-10">
              <div className="size-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ĐÃ DUYỆT HÔM NAY</p>
                 <h4 className="text-xl font-black text-gray-900">12</h4>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Danh sách sản phẩm</h4>
              <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-black rounded-full">Hiện có {products.length} sản phẩm</span>
           </div>
           <div className="flex items-center gap-4">
              <button className="size-10 flex items-center justify-center text-gray-300 hover:text-gray-900"><Filter className="size-5" /></button>
              <button className="size-10 flex items-center justify-center text-gray-300 hover:text-gray-900"><MoreVertical className="size-5" /></button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nông dân</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Giá / Tồn kho</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày đăng</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="size-11 rounded-lg object-cover" alt={product.name} />
                      <div>
                        <p className="text-sm font-black text-gray-900">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <img src={product.farmerImage} className="size-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">{product.farmer}</p>
                        <p className="text-[10px] text-gray-400">{product.farmerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black rounded-full">{product.category}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-orange-600">{product.price}</p>
                      <p className="text-[10px] text-gray-400">{product.stock}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-[11px] font-bold text-gray-400">{product.date}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                       <span className={`size-2 rounded-full bg-current ${product.color}`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${product.color}`}>{product.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-100 transition-colors flex items-center gap-2" title="Xem chi tiết">
                        <Eye className="size-4" /> Xem
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 bg-white border-t border-gray-50 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-medium italic">* Ưu tiên xử lý các sản phẩm đã chờ trên 12 giờ để bảo đảm tính kịp thời.</p>
           <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-400">Trước</button>
              <button className="size-9 bg-[#38703d] text-white rounded-xl text-xs font-black">1</button>
              <button className="size-9 border border-gray-100 rounded-xl text-xs font-black text-gray-400">2</button>
              <button className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-400">Sau</button>
           </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductApproval;
