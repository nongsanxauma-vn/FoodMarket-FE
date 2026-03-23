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
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col group p-4 cursor-pointer">
                  {/* Image area */}
                  <div className="relative h-48 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center mb-6 overflow-hidden">
                    {combo.imageUrl ? (
                      <img src={combo.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={combo.comboName} />
                    ) : (
                      <ChefHat className="size-20 text-green-200 group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <ChefHat className="size-3 text-green-600" />
                      <span className="text-[10px] font-bold uppercase">Combo nấu ăn</span>
                    </div>
                    {combo.region && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm">
                        <span className="text-[10px] font-black text-primary">
                          {combo.region === 'MIEN_BAC' ? '🌿 Bắc' : combo.region === 'MIEN_TRUNG' ? '🌶 Trung' : '🥥 Nam'}
                        </span>
                      </div>
                    )}
                    {savings > 0 && totalOriginal > 0 && (
                      <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                        <Tag className="size-3" />
                        <span className="text-[10px] font-black">-{Math.round((savings / totalOriginal) * 100)}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-lg text-gray-900 truncate pr-2 uppercase tracking-tight">{combo.comboName}</h4>
                      <span className="text-primary font-black text-xl whitespace-nowrap">{combo.discountPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 min-h-[32px]">{combo.description || `${combo.items.length} nguyên liệu tươi ngon`}</p>
                    <div className="space-y-1">
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
                    {savings > 0 && (
                      <p className="text-xs text-green-600 font-bold">Tiết kiệm {savings.toLocaleString('vi-VN')}đ</p>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/combo/${combo.id}`); }}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-black py-3 rounded-xl transition-all mt-2 active:scale-95">
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
