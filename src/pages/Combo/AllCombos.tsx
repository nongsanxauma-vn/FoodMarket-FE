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
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 flex items-center gap-3">
                    <div className="size-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <ChefHat className="size-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-black text-gray-900 text-sm truncate">{combo.comboName}</h4>
                        {combo.region && (
                          <span className="shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full bg-white/80 text-primary border border-primary/20">
                            {combo.region === 'MIEN_BAC' ? '🌿 Bắc' : combo.region === 'MIEN_TRUNG' ? '🌶 Trung' : '🥥 Nam'}
                          </span>
                        )}
                      </div>
                      {combo.description && (
                        <p className="text-xs text-gray-500 font-medium line-clamp-1">{combo.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    {combo.items.slice(0, 4).map((item) => (
                      <div key={item.productId} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 font-medium truncate flex-1 pr-2">• {item.productName}</span>
                        <span className="text-gray-500 font-bold whitespace-nowrap">x{item.quantity}</span>
                      </div>
                    ))}
                    {combo.items.length > 4 && (
                      <p className="text-xs text-gray-400 italic">+{combo.items.length - 4} nguyên liệu khác</p>
                    )}
                  </div>

                  <div className="px-4 pb-4 pt-2 border-t border-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-black text-primary">{combo.discountPrice.toLocaleString('vi-VN')}đ</span>
                        {savings > 0 && (
                          <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                            <Tag className="size-3" /> Tiết kiệm {savings.toLocaleString('vi-VN')}đ
                          </p>
                        )}
                      </div>
                      {savings > 0 && totalOriginal > 0 && (
                        <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-full">
                          -{Math.round((savings / totalOriginal) * 100)}%
                        </span>
                      )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/combo/${combo.id}`); }}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-black py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                      <ChefHat className="size-4" /> Chọn combo này
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
