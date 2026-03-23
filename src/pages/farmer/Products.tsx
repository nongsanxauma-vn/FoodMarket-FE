import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit3, EyeOff, Eye, Trash2, CheckCircle, Clock, AlertCircle, Loader2, X, Sparkles, ChefHat } from 'lucide-react';
import { productService, comboService, mysteryBoxService, authService, ProductResponse, BuildComboResponse, MysteryBox } from '../../services';
import Pagination, { PageInfo } from '../../components/ui/Pagination';
import { globalShowAlert, globalShowConfirm } from '../../contexts/PopupContext';

const PAGE_SIZE = 10;

const Products: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [combos, setCombos] = useState<BuildComboResponse[]>([]);
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([]);
  const [activeTab, setActiveTab] = useState<'NONG_SAN' | 'COMBO' | 'BLIND_BOX'>('NONG_SAN');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [togglingBox, setTogglingBox] = useState<number | null>(null);
  
  const [page, setPage] = useState(0);
  const [shopId, setShopId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const userRes = await authService.getMyInfo();
      const id = userRes.result?.id;
      if (id) {
        setShopId(Number(id));
        const [productsRes, combosRes, mysteryRes] = await Promise.all([
          productService.getByShopId(Number(id)).catch(() => ({ result: [] })),
          comboService.getMyCombos().catch(() => ({ result: [] })),
          mysteryBoxService.getMyBoxes().catch(() => ({ result: [] }))
        ]);
        if (productsRes.result) {
          setProducts(productsRes.result);
        }
        if (combosRes.result) setCombos(combosRes.result);
        if (mysteryRes.result) setMysteryBoxes(mysteryRes.result);
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
  }, []); // Only fetch once initially or when forced

  const handleDelete = async (id: number) => {
    if (!await globalShowConfirm(`Bạn có chắc muốn xóa sản phẩm ID #${id}? Hành động này không thể hoàn tác.`)) return;

    try {
      setIsDeleting(true);
      await productService.deleteProduct(id);
      globalShowAlert('Đã xóa thành công!', 'Thành công', 'success');
      fetchData();
    } catch (err: any) {
      globalShowAlert(err?.data?.message || 'Có lỗi khi xóa sản phẩm', 'Lỗi', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCombo = async (id: number) => {
    if (!await globalShowConfirm(`Bạn có chắc muốn xóa combo/hộp mù ID #${id}? Hành động này không thể hoàn tác.`)) return;

    try {
      setIsDeleting(true);
      await comboService.delete(id);
      globalShowAlert('Đã xóa thành công!', 'Thành công', 'success');
      fetchData();
    } catch (err: any) {
      globalShowAlert(err?.data?.message || 'Có lỗi khi xóa combo/hộp mù', 'Lỗi', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMysteryBox = async (id: number) => {
    if (!await globalShowConfirm(`Bạn có chắc muốn xóa hộp mù ID #${id}?`)) return;
    try {
      setIsDeleting(true);
      await mysteryBoxService.deleteMysteryBox(id);
      globalShowAlert('Đã xóa thành công!', 'Thành công', 'success');
      fetchData();
    } catch (err: any) {
      globalShowAlert(err?.data?.message || 'Có lỗi khi xóa hộp mù', 'Lỗi', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditCombo = (id: number) => {
    onNavigate(`combo-builder/${id}`);
  };

  const handleToggleBoxActive = async (box: MysteryBox) => {
    try {
      setTogglingBox(box.id);
      await mysteryBoxService.toggleActive(box.id);
      fetchData();
    } catch (err: any) {
      globalShowAlert(err?.data?.message || 'Không thể thay đổi trạng thái túi mù', 'Lỗi', 'error');
    } finally {
      setTogglingBox(null);
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

  // Filter Logic
  const filteredProducts = products.filter(p => {
    const matchSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery);
    const matchCategory = categoryFilter === '' || p.categoryId === categoryFilter;
    let matchStatus = true;
    if (statusFilter === 'IN_STOCK') matchStatus = p.stockQuantity > 0;
    if (statusFilter === 'OUT_OF_STOCK') matchStatus = p.stockQuantity <= 0;
    return matchSearch && matchCategory && matchStatus;
  });

  const filteredCombos = combos.filter(c => {
    const matchSearch = c.comboName.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toString().includes(searchQuery);
    return matchSearch;
  });

  const filteredBoxes = mysteryBoxes.filter(b => {
    const matchSearch = b.boxType.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toString().includes(searchQuery);
    let matchStatus = true;
    if (statusFilter === 'ACTIVE') matchStatus = Boolean(b.isActive && b.isActive !== 0);
    if (statusFilter === 'INACTIVE') matchStatus = !b.isActive || b.isActive === 0;
    return matchSearch && matchStatus;
  });

  // Calculate generic derived state based on activeTab
  let displayItems: any[] = [];
  if (activeTab === 'NONG_SAN') displayItems = filteredProducts;
  else if (activeTab === 'COMBO') displayItems = filteredCombos;
  else if (activeTab === 'BLIND_BOX') displayItems = filteredBoxes;

  const totalElements = displayItems.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE) || 1;
  const currentPageData = displayItems.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const pageInfo: PageInfo = {
    page,
    size: PAGE_SIZE,
    totalElements,
    totalPages,
    first: page === 0,
    last: page >= totalPages - 1,
  };

  const CATEGORY_MAP = [
    { id: 1, name: 'Rau củ' },
    { id: 2, name: 'Trái cây' },
    { id: 3, name: 'Thịt cá' },
    { id: 4, name: 'Khác' },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Quản Lý Sản Phẩm</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Cửa hàng của bạn đang có {products.length} sản phẩm, {combos.length} combo và {mysteryBoxes.length} hộp mù.</p>
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'COMBO') onNavigate('combo-builder');
            else if (activeTab === 'BLIND_BOX') onNavigate('mystery-box-editor');
            else onNavigate('add-product');
          }} 
          className="px-6 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
        >
          <Plus className="size-5" /> Thêm sản phẩm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm w-fit">
        <button
          onClick={() => { setActiveTab('NONG_SAN'); setPage(0); setCategoryFilter(''); setStatusFilter(''); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'NONG_SAN' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          NÔNG SẢN ({products.length})
        </button>
        <button
          onClick={() => { setActiveTab('COMBO'); setPage(0); setCategoryFilter(''); setStatusFilter(''); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'COMBO' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          TÚI COMBO ({combos.length})
        </button>
        <button
          onClick={() => { setActiveTab('BLIND_BOX'); setPage(0); setCategoryFilter(''); setStatusFilter(''); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'BLIND_BOX' ? 'bg-purple-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          HỘP MÙ ({mysteryBoxes.length})
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
            <input 
              type="text" 
              placeholder="Tìm kiếm tên sản phẩm hoặc ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all" 
            />
          </div>
          
          {activeTab === 'NONG_SAN' && (
            <select 
              value={categoryFilter} 
              onChange={(e) => { 
                const val = e.target.value;
                setCategoryFilter(val ? Number(val) : ''); 
                setPage(0); 
              }}
              className="px-6 py-3 bg-gray-50 border border-gray-100 focus:border-primary/20 rounded-2xl text-xs font-bold text-gray-600 outline-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {CATEGORY_MAP.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}

          {activeTab !== 'COMBO' && (
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="px-6 py-3 bg-gray-50 border border-gray-100 focus:border-primary/20 rounded-2xl text-xs font-bold text-gray-600 outline-none cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              {activeTab === 'NONG_SAN' && (
                <>
                  <option value="IN_STOCK">Đang bán (Còn hàng)</option>
                  <option value="OUT_OF_STOCK">Hết hàng</option>
                </>
              )}
              {activeTab === 'BLIND_BOX' && (
                <>
                  <option value="ACTIVE">Đang Mở</option>
                  <option value="INACTIVE">Đã Ẩn</option>
                </>
              )}
            </select>
          )}
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
              {activeTab === 'NONG_SAN' && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-10 text-center text-gray-400 font-bold">Không tìm thấy sản phẩm nào. {products.length === 0 && 'Hãy thêm sản phẩm mới!'}</td>
                </tr>
              )}
              {activeTab === 'NONG_SAN' && currentPageData.map((p) => {
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
                            onClick={() => onNavigate(`edit-product/${p.id}`)}
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
              {activeTab === 'COMBO' && currentPageData.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl flex items-center justify-center shadow-sm text-white bg-orange-500 overflow-hidden flex-shrink-0">
                        {c.imageUrl
                          ? <img src={c.imageUrl} className="w-full h-full object-cover" alt={c.comboName} />
                          : <ChefHat className="size-6" />}
                      </div>
                      <div>
                        <p className="text-sm font-black line-clamp-1 max-w-[200px] text-orange-600">{c.comboName}</p>
                        <p className="text-[10px] text-gray-400 font-bold tracking-wider">{c.items.length} thành phần phụ</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-black text-gray-800">{(c.discountPrice || 0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-green-50 text-green-600">Đang Mở</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEditCombo(c.id)} disabled={isDeleting} className="size-9 bg-gray-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-50 cursor-pointer">
                        <Edit3 className="size-4" />
                      </button>
                      <button disabled={isDeleting} className="size-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50">
                        <EyeOff className="size-4" />
                      </button>
                      <button onClick={() => handleDeleteCombo(c.id)} disabled={isDeleting} className="size-9 bg-gray-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeTab === 'COMBO' && filteredCombos.length === 0 && (
                <tr><td colSpan={4} className="px-10 py-10 text-center text-gray-400 font-bold">Không tìm thấy Combo nào.</td></tr>
              )}

              {/* Mystery Box Rows */}
              {activeTab === 'BLIND_BOX' && currentPageData.map((box) => (
                <tr key={box.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl overflow-hidden shadow-sm bg-purple-500 flex items-center justify-center text-white flex-shrink-0">
                        {box.imageUrl
                          ? <img src={box.imageUrl} className="w-full h-full object-cover" />
                          : <Sparkles className="size-6" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-black line-clamp-1 max-w-[200px] text-purple-700">{box.boxType}</p>
                        <p className="text-[10px] text-gray-400 font-bold tracking-wider">ID: {box.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-black text-gray-800">{(box.price || 0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-6 py-5 text-center">
                    {box.isActive
                      ? <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-green-50 text-green-600">Đang Mở</span>
                      : <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-gray-100 text-gray-400">Đã Ẩn</span>
                    }
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onNavigate(`mystery-box-editor/${box.id}`)} disabled={isDeleting} className="size-9 bg-gray-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-50 cursor-pointer">
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleToggleBoxActive(box)}
                        disabled={togglingBox === box.id}
                        title={box.isActive ? 'Ẩn túi mù' : 'Hiện túi mù'}
                        className={`size-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer ${box.isActive ? 'bg-gray-50 text-gray-400 hover:bg-gray-100' : 'bg-green-50 text-green-500 hover:bg-green-100'}`}
                      >
                        {togglingBox === box.id
                          ? <Loader2 className="size-4 animate-spin" />
                          : box.isActive ? <EyeOff className="size-4" /> : <Eye className="size-4" />
                        }
                      </button>
                      <button onClick={() => handleDeleteMysteryBox(box.id)} disabled={isDeleting} className="size-9 bg-gray-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeTab === 'BLIND_BOX' && filteredBoxes.length === 0 && (
                <tr><td colSpan={4} className="px-10 py-10 text-center text-gray-400 font-bold">Không tìm thấy Hộp mù nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Hiển thị {currentPageData.length} mục trên tổng số {totalElements} mục
          </p>
        </div>
        {totalElements > 0 && (
          <Pagination pageInfo={pageInfo} onPageChange={setPage} className="px-6" />
        )}
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
