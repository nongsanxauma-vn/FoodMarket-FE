import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productService, ProductResponse, mysteryBoxService, MysteryBox, comboService, BuildComboResponse } from '../services';
import {
  Star,
  MapPin,
  ShoppingCart,
  Loader2,
  SearchX,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  ChefHat,
  Award,
} from 'lucide-react';

interface SearchResultsProps {
  onSelectProduct: (id: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ onSelectProduct }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([]);
  const [combos, setCombos] = useState<BuildComboResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || queryParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, boxesRes, combosRes] = await Promise.all([
          productService.getAll().catch(() => ({ result: [] })),
          mysteryBoxService.getAll().catch(() => ({ result: [] })),
          comboService.getAll().catch(() => ({ result: [] })),
        ]);

        if (productsRes?.result && Array.isArray(productsRes.result)) {
          setProducts(productsRes.result.filter(p => p && (p.status === 'AVAILABLE' || !p.status) && p.id && !isNaN(p.id)));
        }
        if (boxesRes?.result && Array.isArray(boxesRes.result)) {
          setMysteryBoxes(boxesRes.result.filter((b: MysteryBox) => b && b.isActive !== false && b.isActive !== 0));
        }
        if (combosRes?.result && Array.isArray(combosRes.result)) {
          setCombos(combosRes.result.filter((c: BuildComboResponse) => c && c.id));
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter all items based on search query
  const filteredResults = useMemo(() => {
    if (!searchQuery) return { products: [], boxes: [], combos: [], total: 0 };

    const lowQuery = searchQuery.toLowerCase();
    
    const filteredProducts = products.filter(p => 
      p && p.productName && (
        p.productName.toLowerCase().includes(lowQuery) || 
        (p.description && p.description.toLowerCase().includes(lowQuery)) ||
        (p.shopName && p.shopName.toLowerCase().includes(lowQuery))
      )
    );

    const filteredBoxes = mysteryBoxes.filter(b =>
      b && b.boxType && (
        b.boxType.toLowerCase().includes(lowQuery) ||
        (b.description && b.description.toLowerCase().includes(lowQuery))
      )
    );

    const filteredCombos = combos.filter(c =>
      c && c.comboName && (
        c.comboName.toLowerCase().includes(lowQuery) ||
        (c.description && c.description.toLowerCase().includes(lowQuery)) ||
        (c.items && Array.isArray(c.items) && c.items.some(item => item && item.productName && item.productName.toLowerCase().includes(lowQuery)))
      )
    );

    return {
      products: filteredProducts,
      boxes: filteredBoxes,
      combos: filteredCombos,
      total: filteredProducts.length + filteredBoxes.length + filteredCombos.length,
    };
  }, [products, mysteryBoxes, combos, searchQuery]);

  // Combine all results for pagination
  const allResults = useMemo(() => {
    return [
      ...filteredResults.products.map(p => ({ type: 'product' as const, data: p })),
      ...filteredResults.boxes.map(b => ({ type: 'box' as const, data: b })),
      ...filteredResults.combos.map(c => ({ type: 'combo' as const, data: c })),
    ];
  }, [filteredResults]);

  // Pagination
  const totalPages = Math.ceil(allResults.length / itemsPerPage);
  const paginatedResults = allResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearSearch = () => {
    navigate('/');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold text-primary/60 uppercase tracking-widest mb-6">
        <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">
          Trang chủ
        </button>
        <ChevronRight className="size-3" />
        <span className="text-primary">Kết quả tìm kiếm</span>
      </nav>

      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Kết quả cho "{searchQuery}"
          </h1>
          <p className="text-gray-500 font-medium">
            {isLoading ? 'Đang tìm kiếm...' : `Tìm thấy ${filteredResults.total} kết quả`}
          </p>
        </div>
        <button 
          onClick={clearSearch}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors px-4 py-2 rounded-xl hover:bg-red-50"
        >
          <X className="size-4" /> Xóa tìm kiếm
        </button>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="text-gray-400 font-bold">Đang tìm kiếm sản phẩm...</p>
        </div>
      ) : allResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
          <SearchX className="size-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-black text-gray-800 mb-2">Không tìm thấy kết quả nào</h3>
          <p className="text-gray-500 font-medium mb-8 text-center max-w-xs">
            Chúng mình không tìm thấy sản phẩm khớp với từ khóa của bạn. Thử tìm từ khác xem sao?
          </p>
          <button 
            onClick={clearSearch}
            className="px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {paginatedResults.map((result, index) => {
              if (result.type === 'product') {
                const product = result.data as ProductResponse;
                return (
                  <div
                    key={`product-${product.id}`}
                    onClick={() => onSelectProduct(product.id?.toString() || '')}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col cursor-pointer group"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        src={product.imageUrl || 'https://picsum.photos/seed/product/400/300'} 
                        alt={product.productName || 'Sản phẩm'} 
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectProduct(product.id?.toString() || ''); }}
                        className="absolute bottom-4 right-4 size-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                      >
                        <ShoppingCart className="size-5" />
                      </button>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-primary text-[10px] font-bold uppercase">Nông sản</span>
                        <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                          <MapPin className="size-3" /> {product.shopName || 'Vườn nhà'}
                        </div>
                      </div>
                      <h3 className="text-gray-900 font-extrabold text-lg line-clamp-1">{product.productName || 'Sản phẩm'}</h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="size-4 fill-current" />
                        <span className="text-xs font-bold text-gray-900">4.9</span>
                        <span className="text-gray-400 text-[10px]">(100+)</span>
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <div className="flex flex-col">
                          <span className="text-primary font-black text-2xl">{(product.sellingPrice || 0).toLocaleString('vi-VN')}đ</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Mỗi {product.unit || 'kg'}</span>
                        </div>
                        <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md">TƯƠI SẠCH</span>
                      </div>
                    </div>
                  </div>
                );
              } else if (result.type === 'box') {
                const box = result.data as MysteryBox;
                return (
                  <div
                    key={`box-${box.id}`}
                    onClick={() => onSelectProduct(`box-${box.id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col group p-4 cursor-pointer"
                  >
                    <div className="relative h-48 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mb-6 overflow-hidden">
                      {box.imageUrl ? (
                        <img src={box.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={box.boxType || 'Túi mù'} />
                      ) : (
                        <>
                          <ShoppingCart className="size-20 text-green-200 group-hover:scale-110 transition-transform duration-500" />
                          <span className="absolute text-3xl font-black text-primary/40">?</span>
                        </>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Award className="size-3 text-green-600" />
                        <span className="text-[10px] font-bold uppercase">Túi mù</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectProduct(`box-${box.id}`); }}
                        className="absolute bottom-3 right-3 size-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                      >
                        <ShoppingCart className="size-5" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-lg text-gray-900 truncate pr-2 uppercase tracking-tight">{box.boxType || 'Túi mù'}</h4>
                        <span className="text-primary font-black text-xl whitespace-nowrap">{(box.price || 0).toLocaleString('vi-VN')}đ</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 min-h-[32px]">{box.description || 'Hộp quà nông sản bí ẩn từ farm'}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectProduct(`box-${box.id}`); }}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-3 rounded-xl transition-all mt-2 active:scale-95"
                      >
                        CHỌN TÚI NÀY
                      </button>
                    </div>
                  </div>
                );
              } else {
                const combo = result.data as BuildComboResponse;
                const items = combo.items || [];
                const totalOriginal = items.reduce((sum, item) => sum + (item?.price || 0) * (item?.quantity || 0), 0);
                const savings = totalOriginal - (combo.discountPrice || 0);
                return (
                  <div 
                    key={`combo-${combo.id}`} 
                    onClick={() => onSelectProduct(`combo-${combo.id}`)} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer"
                  >
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 flex items-center gap-3">
                      <div className="size-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <ChefHat className="size-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-black text-gray-900 text-sm truncate">{combo.comboName || 'Combo'}</h4>
                          {combo.region && (
                            <span className="shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full bg-white/80 text-primary border border-primary/20">
                              {combo.region === 'MIEN_BAC' ? '🌿 Bắc' : combo.region === 'MIEN_TRUNG' ? '🌶 Trung' : '🥥 Nam'}
                            </span>
                          )}
                        </div>
                        {combo.description && (
                          <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">{combo.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {items.slice(0, 3).map((item, idx) => (
                        <div key={item?.productId || idx} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 font-medium truncate flex-1 pr-2">• {item?.productName || 'Sản phẩm'}</span>
                          <span className="text-gray-500 font-bold whitespace-nowrap">x{item?.quantity || 0}</span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <p className="text-[10px] text-gray-400 font-bold">+{items.length - 3} sản phẩm khác</p>
                      )}
                    </div>
                    <div className="px-4 pb-4 pt-2 border-t border-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xl font-black text-primary">{(combo.discountPrice || 0).toLocaleString('vi-VN')}đ</span>
                          {savings > 0 && (
                            <p className="text-[10px] text-green-600 font-bold">
                              Tiết kiệm {savings.toLocaleString('vi-VN')}đ
                            </p>
                          )}
                        </div>
                        {savings > 0 && totalOriginal > 0 && (
                          <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-full">
                            -{Math.round((savings / totalOriginal) * 100)}%
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectProduct(`combo-${combo.id}`); }}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <ChefHat className="size-4" />
                        Chọn combo này
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
              >
                <ChevronLeft className="size-5" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="w-10 h-10 flex items-center justify-center font-bold text-sm text-gray-400">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors font-bold text-sm text-gray-700"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default SearchResults;
