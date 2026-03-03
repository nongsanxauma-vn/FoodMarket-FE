import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit3, EyeOff, Trash2, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { productService, ProductResponse, authService } from '../../services';

const Products: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const userRes = await authService.getMyInfo();
      if (userRes.result && userRes.result.id) {
        const productsRes = await productService.getByShopId(Number(userRes.result.id));
        if (productsRes.result) {
          setProducts(productsRes.result);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      // Fallback if token expires or network crashes
      setError('Mất kết nối tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm ID #${id}? Hành động này không thể hoàn tác.`)) return;

    try {
      setIsDeleting(true);
      await productService.deleteProduct(id);
      alert('Đã xóa sản phẩm thành công!');
      fetchProducts(); // reload list
    } catch (err: any) {
      alert(err?.data?.message || 'Có lỗi khi xóa sản phẩm');
    } finally {
      setIsDeleting(false);
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

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Quản Lý Sản Phẩm</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Bạn đang quản lý {products.length} sản phẩm nông sản.</p>
        </div>
        <button onClick={() => onNavigate('add-product')} className="px-6 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
          <Plus className="size-5" /> Thêm sản phẩm mới
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-bold">
          <AlertCircle className="size-6" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm tên sản phẩm..." className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <select className="px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-gray-600 outline-none">
            <option>Tất cả danh mục</option>
          </select>
          <select className="px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-gray-600 outline-none">
            <option>Trạng thái</option>
          </select>
          <button className="size-11 flex items-center justify-center bg-gray-50 rounded-2xl text-gray-500 hover:bg-gray-100 transition-colors">
            <Filter className="size-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Unit / DVT</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Giá bán</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tồn kho</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-10 text-center text-gray-400 font-bold">Bạn chưa có sản phẩm nào. Hãy thêm sản phẩm mới!</td>
                </tr>
              ) : products.map((p) => {
                const isOut = p.stockQuantity <= 0;
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img src={p.imageUrl || 'https://picsum.photos/seed/product/80/80'} className="size-12 rounded-2xl object-cover shadow-sm bg-gray-100" />
                        <div>
                          <p className="text-sm font-black text-gray-900 line-clamp-1 max-w-[200px]">{p.productName}</p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-wider">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase">{p.unit || 'KG'}</span>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-black text-gray-800">{(p.sellingPrice || 0).toLocaleString('vi-VN')}đ</td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`text-sm font-black ${isOut ? 'text-red-500' : 'text-gray-800'}`}>{p.stockQuantity || 0}</span>
                        <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${isOut ? 'bg-red-500' : 'bg-primary'}`} style={{ width: isOut ? '0%' : '60%' }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${isOut ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-600'}`}>
                        {isOut ? 'Hết hàng' : 'Đang bán'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button disabled={isDeleting} className="size-9 bg-gray-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-50">
                          <Edit3 className="size-4" />
                        </button>
                        <button disabled={isDeleting} className="size-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50">
                          <EyeOff className="size-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} disabled={isDeleting} className="size-9 bg-gray-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hiển thị {products.length} sản phẩm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Đang kinh doanh', value: `${products.length} sản phẩm`, icon: CheckCircle, color: 'text-primary bg-primary/5' },
          { label: 'Hết hàng', value: `${products.filter(p => !p.stockQuantity).length} sản phẩm`, icon: Clock, color: 'text-red-500 bg-red-50/50' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`size-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="size-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className={`text-xl font-black ${stat.color.split(' ')[0]}`}>{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
