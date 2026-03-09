import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit3, EyeOff, Trash2, CheckCircle, Clock, AlertCircle, Loader2, X, Sparkles, ChefHat } from 'lucide-react';
import { productService, comboService, authService, ProductResponse, ProductCreationRequest, BuildComboResponse } from '../../services';

interface EditModalProps {
  product: ProductResponse;
  onClose: () => void;
  onSuccess: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ product, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    productName: product.productName || '',
    unit: product.unit || '',
    sellingPrice: product.sellingPrice || 0,
    stockQuantity: product.stockQuantity || 0,
    description: product.description || '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(product.imageUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'sellingPrice' || name === 'stockQuantity' ? Number(value) : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const data: Partial<ProductCreationRequest> = {
        productName: form.productName,
        unit: form.unit,
        sellingPrice: form.sellingPrice,
        stockQuantity: form.stockQuantity,
        description: form.description,
      };
      await productService.updateProduct(product.id, data, image || undefined);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || 'Có lỗi khi cập nhật sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-black text-gray-900">Cập nhật sản phẩm</h3>
          <button onClick={onClose} className="size-10 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-bold flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />{error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Ảnh sản phẩm</label>
            <div className="flex items-center gap-4">
              <img src={preview || 'https://picsum.photos/seed/product/80/80'} className="size-16 rounded-2xl object-cover shadow-sm bg-gray-100" />
              <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm rounded-xl transition-colors">
                Thay đổi ảnh
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Product name */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tên sản phẩm *</label>
            <input name="productName" value={form.productName} onChange={handleChange} required
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Đơn vị tính</label>
            <select name="unit" value={form.unit} onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all">
              <option value="KG">KG</option>
              <option value="HOP">Hộp</option>
              <option value="CAI">Cái</option>
              <option value="GIO">Giỏ</option>
              <option value="TRAI">Trái</option>
              <option value="BICH">Bịch</option>
            </select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Giá bán (₫) *</label>
              <input name="sellingPrice" type="number" min="0" value={form.sellingPrice} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tồn kho *</label>
              <input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={isSaving}
              className="flex-1 py-3.5 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {isSaving ? <><Loader2 className="size-4 animate-spin" /> Đang lưu...</> : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Products: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [combos, setCombos] = useState<BuildComboResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'NONG_SAN' | 'COMBO' | 'BLIND_BOX'>('NONG_SAN');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const userRes = await authService.getMyInfo();
      const shopId = userRes.result?.id;
      if (shopId) {
        const [productsRes, combosRes] = await Promise.all([
          productService.getByShopId(Number(shopId)).catch(() => ({ result: [] })),
          comboService.getByShop(Number(shopId)).catch(() => ({ result: [] }))
        ]);
        if (productsRes.result) setProducts(productsRes.result);
        if (combosRes.result) setCombos(combosRes.result);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Mất kết nối tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm ID #${id}? Hành động này không thể hoàn tác.`)) return;

    try {
      setIsDeleting(true);
      await productService.deleteProduct(id);
      alert('Đã xóa thành công!');
      fetchData();
    } catch (err: any) {
      alert(err?.data?.message || 'Có lỗi khi xóa sản phẩm');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCombo = async (id: number) => {
    if (!window.confirm(`Bạn có chắc muốn xóa combo/hộp mù ID #${id}? Hành động này không thể hoàn tác.`)) return;

    try {
      setIsDeleting(true);
      await comboService.delete(id);
      alert('Đã xóa thành công!');
      fetchData();
    } catch (err: any) {
      alert(err?.data?.message || 'Có lỗi khi xóa combo/hộp mù');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditCombo = (id: number) => {
    onNavigate(`combo-builder/${id}`);
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
      {/* Edit Modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={fetchData}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Quản Lý Sản Phẩm</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Cửa hàng của bạn đang có {products.length} sản phẩm và {combos.length} combo.</p>
        </div>
        <button onClick={() => onNavigate('add-product')} className="px-6 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
          <Plus className="size-5" /> Thêm sản phẩm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('NONG_SAN')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'NONG_SAN' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          NÔNG SẢN ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('COMBO')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'COMBO' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          TÚI COMBO ({combos.filter(c => c.type === 'CUSTOM').length})
        </button>
        <button
          onClick={() => setActiveTab('BLIND_BOX')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'BLIND_BOX' ? 'bg-purple-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          HỘP MÙ ({combos.filter(c => c.type !== 'CUSTOM').length})
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
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeTab === 'NONG_SAN' ? 'Sản phẩm' : 'Tên Combo / Hộp mù'}</th>
                {activeTab === 'NONG_SAN' && <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Unit / DVT</th>}
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Giá bán</th>
                {activeTab === 'NONG_SAN' && <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tồn kho</th>}
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeTab === 'NONG_SAN' && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-10 text-center text-gray-400 font-bold">Bạn chưa có sản phẩm nào. Hãy thêm sản phẩm mới!</td>
                </tr>
              )}
              {activeTab === 'NONG_SAN' && products.map((p) => {
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
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            disabled={isDeleting}
                            title="Chỉnh sửa sản phẩm"
                            className="size-9 bg-gray-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Edit3 className="size-4" />
                          </button>
                          <button disabled={isDeleting} className="size-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50">
                            <EyeOff className="size-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} disabled={isDeleting} className="size-9 bg-gray-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Combo Rows */}
              {activeTab !== 'NONG_SAN' && combos.filter(c => activeTab === 'COMBO' ? c.type === 'CUSTOM' : c.type !== 'CUSTOM').map((c) => {
                const isBlindBox = c.type !== 'CUSTOM';
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center shadow-sm text-white ${isBlindBox ? 'bg-purple-500' : 'bg-orange-500'}`}>
                          {isBlindBox ? <Sparkles className="size-6" /> : <ChefHat className="size-6" />}
                        </div>
                        <div>
                          <p className={`text-sm font-black line-clamp-1 max-w-[200px] ${isBlindBox ? 'text-purple-700' : 'text-orange-600'}`}>
                            {c.comboName}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-wider">{c.items.length} thành phần phụ</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-black text-gray-800">{(c.discountPrice || 0).toLocaleString('vi-VN')}đ</td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-green-50 text-green-600">
                        Đang Mở
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditCombo(c.id)}
                          disabled={isDeleting}
                          title="Chỉnh sửa combo"
                          className="size-9 bg-gray-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button disabled={isDeleting} className="size-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50">
                          <EyeOff className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCombo(c.id)}
                          disabled={isDeleting}
                          className="size-9 bg-gray-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {activeTab !== 'NONG_SAN' && combos.filter(c => activeTab === 'COMBO' ? c.type === 'CUSTOM' : c.type !== 'CUSTOM').length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-10 text-center text-gray-400 font-bold">
                    Không có dữ liệu cho loại {activeTab === 'COMBO' ? 'Combo' : 'Hộp mù'} này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Hiển thị {activeTab === 'NONG_SAN' ? products.length : combos.filter(c => activeTab === 'COMBO' ? c.type === 'CUSTOM' : c.type !== 'CUSTOM').length} mục
          </p>
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
