import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Minus,
  Check,
  Trash2,
  ShoppingCart,
  Clock,
  ChefHat,
  Sparkles,
  X
} from 'lucide-react';
import { MOCK_PRODUCTS, DISH_SUGGESTIONS } from '../../constants/index';

interface SelectedIngredient {
  productId: string;
  productName: string;
  quantity: number;
}

const ComboBuilder: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [comboName, setComboName] = useState('');
  const [comboDescription, setComboDescription] = useState('');
  const [comboPrice, setComboPrice] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Get suggested dishes based on selected ingredients
  const suggestedDishes = useMemo(() => {
    const dishes: { [key: string]: any } = {};
    selectedIngredients.forEach(ing => {
      const suggestions = DISH_SUGGESTIONS[ing.productId] || [];
      suggestions.forEach(dish => {
        if (!dishes[dish.id]) {
          dishes[dish.id] = dish;
        }
      });
    });
    return Object.values(dishes);
  }, [selectedIngredients]);

  // Calculate total combo price
  const totalIngredientsPrice = useMemo(() => {
    return selectedIngredients.reduce((total, ing) => {
      const product = MOCK_PRODUCTS.find(p => p.id === ing.productId);
      return total + (product?.price ?? 0) * ing.quantity;
    }, 0);
  }, [selectedIngredients]);

  const handleAddIngredient = (productId: string) => {
    const existing = selectedIngredients.find(ing => ing.productId === productId);
    if (existing) {
      setSelectedIngredients(
        selectedIngredients.map(ing =>
          ing.productId === productId ? { ...ing, quantity: ing.quantity + 1 } : ing
        )
      );
    } else {
      const product = MOCK_PRODUCTS.find(p => p.id === productId);
      if (product) {
        setSelectedIngredients([
          ...selectedIngredients,
          { productId, productName: product.name, quantity: 1 }
        ]);
      }
    }
  };

  const handleRemoveIngredient = (productId: string) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveIngredient(productId);
    } else {
      setSelectedIngredients(
        selectedIngredients.map(ing =>
          ing.productId === productId ? { ...ing, quantity } : ing
        )
      );
    }
  };

  const handleSaveCombo = () => {
    if (!comboName || selectedIngredients.length === 0) {
      alert('Vui lòng nhập tên combo và chọn ít nhất một nguyên liệu');
      return;
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setComboName('');
      setComboDescription('');
      setComboPrice('');
      setSelectedIngredients([]);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-white pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6 border-b border-gray-100 mb-8">
        <button
          onClick={onBack}
          className="size-11 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black font-display text-gray-900">Tạo Combo Nấu Ăn</h1>
          <p className="text-gray-400 font-medium text-sm mt-1">Kết hợp các nguyên liệu để gợi ý các món ăn cho người mua</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Combo Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <ChefHat className="size-5" />
              </div>
              <h3 className="font-black text-gray-800 uppercase tracking-tight">Thông Tin Combo</h3>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-700">Tên Combo *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Combo Salad Tươi Mát"
                  value={comboName}
                  onChange={(e) => setComboName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-700">Mô Tả Combo</label>
                <textarea
                  placeholder="Mô tả chi tiết về combo, lợi ích sức khỏe, cách sử dụng..."
                  value={comboDescription}
                  onChange={(e) => setComboDescription(e.target.value)}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-700">Giá Combo (VNĐ)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={comboPrice}
                    onChange={(e) => setComboPrice(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">đ</span>
                </div>
                {totalIngredientsPrice > 0 && (
                  <p className="text-xs text-gray-500 mt-2">Giá nguyên liệu: {totalIngredientsPrice.toLocaleString('vi-VN')}đ</p>
                )}
              </div>
            </div>
          </div>

          {/* Selected Ingredients */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <Sparkles className="size-5" />
              </div>
              <h3 className="font-black text-gray-800 uppercase tracking-tight">Nguyên Liệu Đã Chọn ({selectedIngredients.length})</h3>
            </div>

            {selectedIngredients.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-8">Chọn nguyên liệu từ bên dưới để bắt đầu</p>
            ) : (
              <div className="space-y-3">
                {selectedIngredients.map((ing) => {
                  const product = MOCK_PRODUCTS.find(p => p.id === ing.productId);
                  return (
                    <div key={ing.productId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={product?.image}
                          alt={ing.productName}
                          className="size-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">{ing.productName}</p>
                          <p className="text-xs text-gray-500">{product?.unit}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(ing.productId, ing.quantity - 1)}
                            className="p-2 hover:text-primary"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="px-3 font-bold text-sm">{ing.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(ing.productId, ing.quantity + 1)}
                            className="p-2 hover:text-primary"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <p className="font-bold text-primary min-w-[80px] text-right text-sm">
                          {((product?.price ?? 0) * ing.quantity).toLocaleString('vi-VN')}đ
                        </p>
                        <button
                          onClick={() => handleRemoveIngredient(ing.productId)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Suggested Dishes */}
          {suggestedDishes.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <ChefHat className="size-5" />
                </div>
                <h3 className="font-black text-gray-800 uppercase tracking-tight">Gợi Ý Món Ăn ({suggestedDishes.length})</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedDishes.map((dish) => (
                  <div key={dish.id} className="group cursor-pointer border border-gray-100 rounded-xl overflow-hidden hover:border-primary/30 transition-all">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                          <ShoppingCart className="size-4" />
                          Thêm Vào
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 text-sm mb-2">{dish.name}</h4>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{dish.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-orange-500 font-bold">
                          <Clock className="size-3" />
                          {dish.cookingTime}
                        </div>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded font-bold">
                          {dish.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Available Products */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
            <h3 className="font-black text-gray-800 uppercase tracking-tight mb-6 flex items-center gap-2">
              <ShoppingCart className="size-5 text-primary" />
              Sản Phẩm Của Bạn
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {MOCK_PRODUCTS.map((product) => {
                const isSelected = selectedIngredients.some(ing => ing.productId === product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => handleAddIngredient(product.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all group ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-100 bg-white hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 mb-1 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                        <p className="text-xs font-bold text-primary">
                          {product.price.toLocaleString('vi-VN')}đ/{product.unit}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="size-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="size-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveCombo}
            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-white ${
              isSaved
                ? 'bg-green-500 shadow-lg shadow-green-500/30'
                : 'bg-primary shadow-lg shadow-primary/30 hover:bg-primary-dark'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="size-5" />
                Đã Lưu Thành Công!
              </>
            ) : (
              <>
                <Save className="size-5" />
                Lưu Combo
              </>
            )}
          </button>

          {/* Summary */}
          {selectedIngredients.length > 0 && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6">
              <p className="text-[10px] font-bold uppercase text-primary/70 mb-3">Tóm Tắt</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số nguyên liệu:</span>
                  <span className="font-bold text-gray-800">{selectedIngredients.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng giá nguyên liệu:</span>
                  <span className="font-bold text-primary">{totalIngredientsPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="h-px bg-primary/20 my-2" />
                <div className="flex justify-between">
                  <span className="font-bold text-gray-700 text-sm">Giá Combo:</span>
                  <span className="font-black text-primary text-lg">{(comboPrice || 0).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComboBuilder;
