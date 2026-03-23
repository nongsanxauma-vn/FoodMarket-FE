import React, { useState, useEffect } from 'react';
import { CheckCircle, Search, Filter, MoreVertical, Eye, Trash2, Check, X, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { productService, ProductResponse } from '../../services';
import Pagination, { PageInfo } from '../../components/ui/Pagination';
import { globalShowAlert, globalShowConfirm } from '../../contexts/PopupContext';

const PAGE_SIZE = 10;

const ProductApproval: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingProductId, setRejectingProductId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getAllPaged(page, PAGE_SIZE);
      if (response.result) {
        setProducts(response.result.content);
        setPageInfo({
          page: response.result.page,
          size: response.result.size,
          totalElements: response.result.totalElements,
          totalPages: response.result.totalPages,
          first: response.result.first,
          last: response.result.last,
        });
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Mất kết nối tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleApprove = async (product: ProductResponse) => {
    if (!await globalShowConfirm('Xác nhận', `Bạn có chắc muốn duyệt sản phẩm "${product.productName}"?`)) return;

    try {
      setIsProcessing(true);
      await productService.updateProduct(product.id, {
        productName: product.productName,
        sellingPrice: product.sellingPrice,
        stockQuantity: product.stockQuantity,
        unit: product.unit,
        description: product.description,
        imageUrl: product.imageUrl,
        // The backend expects "status" in some form if it accepts it. We pass it as ANY because the interface might complain.
        status: 'AVAILABLE'
      } as any);

      globalShowAlert(`Đã duyệt sản phẩm ${product.productName}`, 'Thành công', 'success');
      setSelectedProduct(null);
      fetchProducts(); // Reload list
    } catch (err: any) {
      globalShowAlert(err?.data?.message || 'Có lỗi khi duyệt sản phẩm', 'Lỗi', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (productId: number) => {
    setRejectingProductId(productId);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      globalShowAlert('Vui lòng nhập lý do từ chối', 'Lỗi', 'error');
      return;
    }

    if (!rejectingProductId) return;

    try {
      setIsProcessing(true);
      const product = products.find(p => p.id === rejectingProductId);
      if (product) {
        await productService.updateProduct(rejectingProductId, {
          productName: product.productName,
          sellingPrice: product.sellingPrice,
          stockQuantity: product.stockQuantity,
          unit: product.unit,
          description: `[TỪ CHỐI: ${rejectReason}] ${product.description}`,
          imageUrl: product.imageUrl,
          status: 'OUT_OF_STOCK'
        } as any);

        globalShowAlert(`Đã từ chối sản phẩm #${rejectingProductId}`, 'Thành công', 'success');
      }

      setShowRejectModal(false);
      setRejectReason('');
      setRejectingProductId(null);
      setSelectedProduct(null);
      fetchProducts(); // Reload
    } catch (err: any) {
      globalShowAlert(err?.data?.message || 'Có lỗi khi từ chối sản phẩm', 'Lỗi', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

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
              <img src={selectedProduct.imageUrl || 'https://picsum.photos/seed/product/400/400'} alt={selectedProduct.productName} className="w-full h-auto rounded-2xl object-cover mb-6 border border-gray-100 bg-gray-50" />
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">ID SẢN PHẨM</p>
                  <p className="text-sm font-bold text-gray-900">{selectedProduct.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">DANH MỤC</p>
                  <p className="text-sm font-bold text-gray-900">Nông sản</p>
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
                  <p className="text-lg font-black text-gray-900">{selectedProduct.productName}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Giá bán</label>
                    <p className="text-lg font-black text-orange-600">{(selectedProduct.sellingPrice || 0).toLocaleString('vi-VN')}đ / {selectedProduct.unit}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Tồn kho</label>
                    <p className="text-lg font-black text-gray-900">{selectedProduct.stockQuantity}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Mô tả sản phẩm</label>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedProduct.description}</p>
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
                <div className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">
                  {selectedProduct.status === 'AVAILABLE' ? 'Hoạt động' : selectedProduct.status === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Chờ duyệt'}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  disabled={isProcessing}
                  onClick={() => handleApprove(selectedProduct)}
                  className="flex-1 px-6 py-4 bg-emerald-50 text-emerald-600 text-sm font-black rounded-2xl uppercase tracking-widest hover:bg-emerald-100 transition-colors flex items-center justify-center gap-3 border border-emerald-200 disabled:opacity-50"
                >
                  <Check className="size-5" /> Duyệt Sản Phẩm
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => handleRejectClick(selectedProduct.id)}
                  className="flex-1 px-6 py-4 bg-red-50 text-red-600 text-sm font-black rounded-2xl uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-3 border border-red-200 disabled:opacity-50"
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
                  disabled={isProcessing}
                  onClick={confirmReject}
                  className="w-full px-6 py-4 bg-red-600 text-white text-sm font-black rounded-2xl uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <X className="size-5" /> Xác Nhận Từ Chối
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setRejectingProductId(null);
                  }}
                  className="w-full px-6 py-4 bg-gray-50 text-gray-600 text-sm font-black rounded-2xl uppercase tracking-widest hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500 relative">
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
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TỔNG SẢN PHẨM</p>
                <h4 className="text-xl font-black text-gray-900">{pageInfo?.totalElements ?? products.length}</h4>
              </div>
            </div>
            <button onClick={fetchProducts} className="size-12 bg-white rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-bold">
            <AlertCircle className="size-6" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Danh sách sản phẩm</h4>
              <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-black rounded-full">Hiện có {pageInfo?.totalElements ?? products.length} sản phẩm</span>
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
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nông dân ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Giá / Tồn kho</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-10 py-10 text-center text-gray-400 font-bold">Chưa có sản phẩm nào.</td>
                  </tr>
                ) : products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <img src={product.imageUrl || 'https://picsum.photos/seed/product/80/80'} className="size-11 rounded-lg object-cover border border-gray-100 bg-gray-50" alt={product.productName} />
                        <div>
                          <p className="text-sm font-black text-gray-900 break-words max-w-[200px] line-clamp-1">{product.productName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {product.shopOwnerId ? `Shop ID: ${product.shopOwnerId}` : 'Chưa có thông tin'}
                          </p>
                          {!product.shopOwnerId && <p className="text-[10px] text-red-400 font-bold uppercase mt-1">Lỗi BE: Thiếu shopOwnerId</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black rounded-full">Nông sản</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-orange-600">{(product.sellingPrice || 0).toLocaleString('vi-VN')}đ</p>
                        <p className="text-[10px] text-gray-400">{product.stockQuantity || 0} {product.unit}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.status === 'AVAILABLE' ? 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md' :
                          product.status === 'OUT_OF_STOCK' ? 'text-red-600 bg-red-50 px-2 py-1 rounded-md' : 'text-blue-600 bg-blue-50 px-2 py-1 rounded-md'
                          }`}>{product.status === 'AVAILABLE' ? 'HOẠT ĐỘNG' : product.status === 'OUT_OF_STOCK' ? 'HẾT HÀNG' : 'CHỜ DUYỆT'}</span>
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
          {pageInfo && <Pagination pageInfo={pageInfo} onPageChange={setPage} className="px-10" />}
        </div>
      </div>
    </>
  );
};

export default ProductApproval;
