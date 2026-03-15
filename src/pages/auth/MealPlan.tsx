/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Utensils, 
  Calendar, 
  ShoppingCart, 
  CheckCircle2, 
  AlertCircle, 
  Leaf, 
  ChevronRight,
  RefreshCw,
  Trash2,
  Plus
} from 'lucide-react';

// --- Types ---

type MealType = 'Sáng' | 'Trưa' | 'Tối';
type EatingStyle = 'Gia đình' | 'Giảm cân' | 'Ăn chay' | 'Bình dân';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  isUglyProduce?: boolean;
  pricePerUnit: number;
}

interface RecipeItem {
  ingredientId: string;
  quantityPerPerson: number;
}

interface Dish {
  id: string;
  name: string;
  mealType: MealType;
  style: EatingStyle[];
  recipes: RecipeItem[];
  image?: string;
}

interface MealPlanDay {
  day: number;
  meals: Record<MealType, Dish>;
}

// --- Mock Data ---

const INGREDIENTS: Record<string, Ingredient> = {
  'i1': { id: 'i1', name: 'Cà chua', unit: 'g', isUglyProduce: true, pricePerUnit: 0.02 },
  'i2': { id: 'i2', name: 'Bí đỏ', unit: 'g', isUglyProduce: true, pricePerUnit: 0.015 },
  'i3': { id: 'i3', name: 'Rau muống', unit: 'g', pricePerUnit: 0.01 },
  'i4': { id: 'i4', name: 'Trứng gà', unit: 'quả', pricePerUnit: 3000 },
  'i5': { id: 'i5', name: 'Thịt heo', unit: 'g', pricePerUnit: 0.15 },
  'i6': { id: 'i6', name: 'Gạo', unit: 'g', pricePerUnit: 0.02 },
  'i7': { id: 'i7', name: 'Bánh mì', unit: 'cái', pricePerUnit: 5000 },
  'i8': { id: 'i8', name: 'Thịt gà', unit: 'g', pricePerUnit: 0.12 },
  'i9': { id: 'i9', name: 'Cá lóc', unit: 'g', pricePerUnit: 0.18 },
  'i10': { id: 'i10', name: 'Cải xanh', unit: 'g', pricePerUnit: 0.025 },
  'i11': { id: 'i11', name: 'Mướp', unit: 'g', isUglyProduce: true, pricePerUnit: 0.012 },
  'i12': { id: 'i12', name: 'Đậu phụ', unit: 'miếng', pricePerUnit: 3000 },
  'i13': { id: 'i13', name: 'Cà rốt', unit: 'g', isUglyProduce: true, pricePerUnit: 0.018 },
  'i14': { id: 'i14', name: 'Dưa leo', unit: 'g', isUglyProduce: true, pricePerUnit: 0.015 },
};

const DISHES: Dish[] = [
  // Sáng
  { id: 'd1', name: 'Bánh mì trứng', mealType: 'Sáng', style: ['Gia đình', 'Bình dân'], recipes: [{ ingredientId: 'i7', quantityPerPerson: 1 }, { ingredientId: 'i4', quantityPerPerson: 2 }] },
  { id: 'd2', name: 'Cháo gà', mealType: 'Sáng', style: ['Gia đình', 'Bình dân'], recipes: [{ ingredientId: 'i6', quantityPerPerson: 50 }, { ingredientId: 'i8', quantityPerPerson: 100 }] },
  { id: 'd3', name: 'Bún bò', mealType: 'Sáng', style: ['Gia đình', 'Bình dân'], recipes: [{ ingredientId: 'i5', quantityPerPerson: 100 }] },
  { id: 'd4', name: 'Salad dưa leo cà rốt', mealType: 'Sáng', style: ['Giảm cân', 'Ăn chay'], recipes: [{ ingredientId: 'i14', quantityPerPerson: 100 }, { ingredientId: 'i13', quantityPerPerson: 50 }] },
  
  // Trưa
  { id: 'd5', name: 'Thịt kho + Rau muống', mealType: 'Trưa', style: ['Gia đình', 'Bình dân'], recipes: [{ ingredientId: 'i5', quantityPerPerson: 150 }, { ingredientId: 'i3', quantityPerPerson: 100 }] },
  { id: 'd6', name: 'Cá chiên + Rau luộc', mealType: 'Trưa', style: ['Gia đình', 'Bình dân'], recipes: [{ ingredientId: 'i9', quantityPerPerson: 200 }, { ingredientId: 'i10', quantityPerPerson: 100 }] },
  { id: 'd7', name: 'Thịt xào cải', mealType: 'Trưa', style: ['Gia đình', 'Bình dân'], recipes: [{ ingredientId: 'i5', quantityPerPerson: 100 }, { ingredientId: 'i10', quantityPerPerson: 150 }] },
  { id: 'd8', name: 'Đậu phụ sốt cà chua', mealType: 'Trưa', style: ['Ăn chay', 'Bình dân'], recipes: [{ ingredientId: 'i12', quantityPerPerson: 2 }, { ingredientId: 'i1', quantityPerPerson: 100 }] },
  
  // Tối
  { id: 'd9', name: 'Canh bí đỏ', mealType: 'Tối', style: ['Gia đình', 'Bình dân'], recipes: [{ ingredientId: 'i2', quantityPerPerson: 200 }, { ingredientId: 'i5', quantityPerPerson: 50 }] },
  { id: 'd10', name: 'Trứng sốt cà', mealType: 'Tối', style: ['Gia đình', 'Bình dân'], recipes: [{ ingredientId: 'i4', quantityPerPerson: 2 }, { ingredientId: 'i1', quantityPerPerson: 100 }] },
  { id: 'd11', name: 'Canh mướp', mealType: 'Tối', style: ['Gia đình', 'Bình dân'], recipes: [{ ingredientId: 'i11', quantityPerPerson: 150 }, { ingredientId: 'i5', quantityPerPerson: 30 }] },
  { id: 'd12', name: 'Súp cà rốt', mealType: 'Tối', style: ['Giảm cân', 'Ăn chay'], recipes: [{ ingredientId: 'i13', quantityPerPerson: 200 }] },
];

export default function MealPlan() {
  const [numPeople, setNumPeople] = useState<number>(2);
  const [style, setStyle] = useState<EatingStyle>('Gia đình');
  const [numDays, setNumDays] = useState<number>(3);
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  // Generate initial plan on mount
  React.useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = () => {
    const newPlan: MealPlanDay[] = [];
    for (let i = 1; i <= numDays; i++) {
      const dayPlan: MealPlanDay = {
        day: i,
        meals: {
          'Sáng': getRandomDish('Sáng', style),
          'Trưa': getRandomDish('Trưa', style),
          'Tối': getRandomDish('Tối', style),
        }
      };
      newPlan.push(dayPlan);
    }
    setMealPlan(newPlan);
    setIsGenerated(true);
  };

  const getRandomDish = (type: MealType, selectedStyle: EatingStyle): Dish => {
    const filtered = DISHES.filter(d => d.mealType === type && d.style.includes(selectedStyle));
    // Prioritize dishes with ugly produce
    const withUgly = filtered.filter(d => d.recipes.some(r => INGREDIENTS[r.ingredientId].isUglyProduce));
    
    const pool = withUgly.length > 0 && Math.random() > 0.3 ? withUgly : filtered;
    return pool[Math.floor(Math.random() * pool.length)] || filtered[0];
  };

  const shoppingList = useMemo(() => {
    const list: Record<string, number> = {};
    mealPlan.forEach(day => {
      (Object.values(day.meals) as Dish[]).forEach(dish => {
        dish.recipes.forEach(recipe => {
          const totalQty = recipe.quantityPerPerson * numPeople;
          list[recipe.ingredientId] = (list[recipe.ingredientId] || 0) + totalQty;
        });
      });
    });
    return Object.entries(list).map(([id, qty]) => ({
      ...INGREDIENTS[id],
      quantity: qty
    }));
  }, [mealPlan, numPeople]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D2D2D] font-sans selection:bg-emerald-100">
     

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Utensils size={20} className="text-emerald-600" />
                Thiết lập thực đơn
              </h2>
              
              <div className="space-y-6">
                {/* Num People */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 block">Số người ăn</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => setNumPeople(n)}
                        className={`py-2 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                          numPeople === n 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' 
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                      >
                        <Users size={16} />
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 block">Kiểu ăn</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Gia đình', 'Giảm cân', 'Ăn chay', 'Bình dân'].map(s => (
                      <button
                        key={s}
                        onClick={() => setStyle(s as EatingStyle)}
                        className={`py-2 px-3 rounded-xl border text-sm transition-all ${
                          style === s 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' 
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Days */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 block">Số ngày</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[3, 7].map(d => (
                      <button
                        key={d}
                        onClick={() => setNumDays(d)}
                        className={`py-2 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                          numDays === d 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' 
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                      >
                        <Calendar size={16} />
                        {d} ngày
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={generatePlan}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4"
                >
                  <RefreshCw size={20} />
                  {isGenerated ? 'Tạo lại thực đơn' : 'Tạo thực đơn ngay'}
                </button>
              </div>
            </section>

            {/* Ugly Produce Highlight */}
            <section className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <AlertCircle size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Đang có sẵn</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Nông sản "xấu mã"</h3>
                <div className="space-y-3">
                  {Object.values(INGREDIENTS).filter(i => i.isUglyProduce).map(i => (
                    <div key={i.id} className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                      <span className="text-stone-300">{i.name}</span>
                      <span className="text-emerald-400 font-medium">-30% giá</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-stone-400 mt-4 leading-relaxed italic">
                  * Hình dáng không hoàn hảo nhưng chất lượng vẫn tuyệt vời. Giúp giảm lãng phí thực phẩm!
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl"></div>
            </section>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-8">
            {!isGenerated ? (
                <div 
                  className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
                    <Utensils size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">Chưa có thực đơn</h3>
                    <p className="text-stone-500 max-w-xs mx-auto mt-2">
                      Hãy chọn các tùy chọn bên trái để chúng tôi gợi ý thực đơn thông minh cho bạn.
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  className="space-y-8"
                >
                  {/* Meal Plan Grid */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold tracking-tight">Thực đơn của bạn</h2>
                      <span className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full font-medium">
                        {numDays} ngày • {style}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {mealPlan.map((dayPlan) => (
                        <div 
                          key={dayPlan.day}
                          className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="bg-stone-50 px-6 py-3 border-b border-stone-200 flex items-center justify-between">
                            <span className="font-bold text-stone-800">Ngày {dayPlan.day}</span>
                            <div className="flex gap-1">
                              {(Object.values(dayPlan.meals) as Dish[]).some(d => d.recipes.some(r => INGREDIENTS[r.ingredientId].isUglyProduce)) && (
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">Ưu tiên nông sản xanh</span>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-100">
                            {(Object.entries(dayPlan.meals) as [MealType, Dish][]).map(([type, dish]) => (
                              <div key={type} className="p-6 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{type}</span>
                                <h4 className="font-bold text-stone-800 leading-tight">{dish.name}</h4>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {dish.recipes.map(r => (
                                    <span key={r.ingredientId} className={`text-[10px] px-1.5 py-0.5 rounded ${INGREDIENTS[r.ingredientId].isUglyProduce ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-stone-50 text-stone-500'}`}>
                                      {INGREDIENTS[r.ingredientId].name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Shopping List */}
                  <section className="bg-emerald-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <ShoppingCart size={28} className="text-emerald-400" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">Giỏ hàng nguyên liệu</h2>
                            <p className="text-emerald-300/80 text-sm">Tổng hợp từ thực đơn {numDays} ngày</p>
                          </div>
                        </div>
                        <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-8 py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group">
                          Mua tất cả nguyên liệu
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shoppingList.map((item) => (
                          <div 
                            key={item.id} 
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              item.isUglyProduce 
                              ? 'bg-emerald-800/40 border-emerald-500/30' 
                              : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${item.isUglyProduce ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
                              <div>
                                <p className="font-bold">{item.name}</p>
                                {item.isUglyProduce && (
                                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Nông sản xấu mã</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-lg font-bold">
                                {item.quantity >= 1000 ? (item.quantity / 1000).toFixed(1) : item.quantity}
                                <span className="text-xs ml-1 opacity-60 font-sans">{item.quantity >= 1000 ? 'kg' : item.unit}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-300 text-sm">
                          <CheckCircle2 size={16} />
                          <span>Đã tối ưu hóa theo lượng người ăn ({numPeople} người)</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-emerald-300/60 uppercase tracking-widest font-bold">Ước tính</p>
                          <p className="text-2xl font-bold">
                            {Math.round(shoppingList.reduce((acc, curr) => acc + (curr.quantity * curr.pricePerUnit), 0)).toLocaleString()}đ
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                  </section>
                </div>
              )}
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 border-t border-stone-200 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Leaf size={20} className="text-emerald-600" />
              <span className="font-bold text-lg">EcoMeal Planner</span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
              Chúng tôi giúp bạn lên kế hoạch ăn uống lành mạnh, tiết kiệm ngân sách và giảm thiểu lãng phí thực phẩm thông qua việc ủng hộ nông sản "xấu mã".
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Ứng dụng</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><a href="#" className="hover:text-emerald-600">Thực đơn mẫu</a></li>
              <li><a href="#" className="hover:text-emerald-600">Tính toán dinh dưỡng</a></li>
              <li><a href="#" className="hover:text-emerald-600">Bản đồ nông trại</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><a href="#" className="hover:text-emerald-600">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-emerald-600">Hợp tác nông dân</a></li>
              <li><a href="#" className="hover:text-emerald-600">Hỗ trợ</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-stone-200 text-center text-xs text-stone-400">
          © 2026 EcoMeal Planner. Phát triển vì một tương lai bền vững.
        </div>
      </footer>
    </div>
  );
}