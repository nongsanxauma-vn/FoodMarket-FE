import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, Tag, Loader2 } from 'lucide-react';
import { comboService, BuildComboResponse } from '../../services';

const AllCombos: React.FC = () => {
  const navigate = useNavigate();
  const [combos, setCombos] = useState<BuildComboResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    comboService.getAll().then(res => {
      if (res.result) setCombos(res.result);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="size-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all">
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase">Tất Cả Combo Nấu Ăn</h1>
            <p className="text-xs text-gray-400 font-bold">{combos.length} combo đang có sẵn</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Đang tải...</p>
          </div>
        ) : combos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <ChefHat className="size-16 text-gray-300 mb-4" />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Hiện chưa có combo nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map((combo) => {
              const totalOriginal = combo.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
              const savings = totalOriginal - combo.discountPrice;
              return (
                <div key={combo.id} onClick={() => navigate(`/combo/${combo.id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer">
                  {/* Image Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    {combo.imageUrl ? (
                      <img src={combo.imageUrl} alt={combo.comboName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                        <ChefHat className="size-16 text-primary/30" />
                      </div>
                    )}
                    {combo.region && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/95 backdrop-blur shadow-sm text-primary uppercase tracking-widest border border-primary/10">
                          {combo.region === 'MIEN_BAC' ? '🌿 Miền Bắc' : combo.region === 'MIEN_TRUNG' ? '🌶 Miền Trung' : '🥥 Miền Nam'}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <ChefHat className="size-3 text-green-600" />
                      <span className="text-[10px] font-bold uppercase">Combo</span>
                    </div>
                    {savings > 0 && totalOriginal > 0 && (
                      <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                        <Tag className="size-3" />
                        <span className="text-[10px] font-black">-{Math.round((savings / totalOriginal) * 100)}%</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-3">
                        <h4 className="font-black text-gray-900 text-base mb-1 line-clamp-1">{combo.comboName}</h4>
                        {combo.description && (
                          <p className="text-xs text-gray-500 font-medium line-clamp-2">{combo.description}</p>
                        )}
                    </div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-primary font-black text-xl whitespace-nowrap">{combo.discountPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="space-y-1 mb-3 flex-1">
                      {combo.items.slice(0, 2).map((item) => (
                        <div key={item.productId} className="flex items-center justify-between text-xs text-gray-500">
                          <span className="truncate">• {item.productName}</span>
                          <span className="font-bold ml-2">x{item.quantity}</span>
                        </div>
                      ))}
                      {combo.items.length > 2 && (
                        <p className="text-[10px] text-gray-400 font-bold">+{combo.items.length - 2} nguyên liệu khác</p>
                      )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/combo/${combo.id}`); }}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-black py-3 rounded-xl transition-all mt-auto active:scale-95 text-xs">
                      CHỌN COMBO NÀY
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCombos;
