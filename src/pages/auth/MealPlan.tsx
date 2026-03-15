// import React, { useState, useEffect } from 'react';
// import {
//   buildPlanService,
//   BuildPlanResponse,
//   productService,
//   ProductResponse,
//   BuildPlanCreateRequest,
//   BuildPlanItemCreateRequest
// } from '../../services';
// import { useAuth } from '../../contexts/AuthContext';
// import {
//   Calendar,
//   Plus,
//   Trash2,
//   CheckCircle2,
//   ChevronRight,
//   Info,
//   Utensils,
//   Clock,
//   Target,
//   PlusCircle,
//   X,
//   Loader2,
//   CalendarDays
// } from 'lucide-react';

// const MealPlan: React.FC = () => {
//   const { user } = useAuth();
//   const [plans, setPlans] = useState<BuildPlanResponse[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showAddMealModal, setShowAddMealModal] = useState(false);
//   const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

//   // Form states
//   // const [newPlan, setNewPlan] = useState<BuildPlanCreateRequest>({
//   //   planName: '',
//   //   planType: 'WEEKLY',
//   //   targetBudget: 0
//   // });

//   const [newMeal, setNewMeal] = useState<BuildPlanItemCreateRequest>({
//     mealName: '',
//     mealTime: '08:00',
//     description: '',
//     productIds: []
//   });

//   const [availableProducts, setAvailableProducts] = useState<ProductResponse[]>([]);

//   useEffect(() => {
//     fetchPlans();
//     fetchProducts();
//   }, [user]);

//   const fetchPlans = async () => {
//     if (!user?.id) return;
//     try {
//       setIsLoading(true);
//       const res = await buildPlanService.getPlansByBuyer(parseInt(user.id));
//       if (res.result) setPlans(res.result);
//     } catch (err) {
//       console.error('Failed to fetch plans', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await productService.getAll();
//       if (res.result) setAvailableProducts(res.result);
//     } catch (err) {
//       console.error('Failed to fetch products', err);
//     }
//   };

//   const handleCreatePlan = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await buildPlanService.createPlan(newPlan);
//       if (res.result) {
//         setShowCreateModal(false);
//         fetchPlans();
//       }
//     } catch (err: any) {
//       console.error('Create plan failed', err);
//       alert('Lỗi: ' + (err.data?.message || 'Không thể tạo kế hoạch'));
//     }
//   };

//   const handleAddMeal = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (selectedPlanId === null) return;
//     try {
//       await buildPlanService.addMeal(selectedPlanId, newMeal);
//       setShowAddMealModal(false);
//       fetchPlans();
//     } catch (err) {
//       console.error('Add meal failed', err);
//     }
//   };

//   const handleMarkComplete = async (mealId: number) => {
//     try {
//       await buildPlanService.markMealCompleted(mealId);
//       fetchPlans();
//     } catch (err) {
//       console.error('Mark complete failed', err);
//     }
//   };

//   const handleDeletePlan = async (id: number) => {
//     if (!confirm('Bạn có chắc chắn muốn xóa kế hoạch này?')) return;
//     try {
//       await buildPlanService.deletePlan(id);
//       fetchPlans();
//     } catch (err) {
//       console.error('Delete plan failed', err);
//     }
//   };

//   const handleDeleteMeal = async (id: number) => {
//     try {
//       await buildPlanService.deleteMeal(id);
//       fetchPlans();
//     } catch (err) {
//       console.error('Delete meal failed', err);
//     }
//   };

//   return (
//     <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-black text-gray-900 uppercase font-display tracking-tight">Kế hoạch ăn uống</h1>
//           <p className="text-gray-500 font-medium">Thiết lập lộ trình dinh dưỡng lành mạnh cho riêng bạn</p>
//         </div>
//         <button
//           onClick={() => setShowCreateModal(true)}
//           className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
//         >
//           <Plus className="size-5" /> TẠO KẾ HOẠCH MỚI
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="py-20 flex flex-col items-center justify-center gap-4">
//           <Loader2 className="size-10 text-primary animate-spin" />
//           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải kế hoạch của bạn...</p>
//         </div>
//       ) : plans.length === 0 ? (
//         <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-16 text-center shadow-sm">
//           <CalendarDays className="size-16 text-gray-100 mx-auto mb-6" />
//           <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Chưa có kế hoạch nào</h3>
//           <p className="text-gray-400 max-w-sm mx-auto mb-8 font-medium">Bắt đầu hành trình sống khỏe bằng cách lập kế hoạch ăn uống đầu tiên ngay hôm nay.</p>
//           <button
//             onClick={() => setShowCreateModal(true)}
//             className="text-primary font-black flex items-center gap-2 mx-auto hover:underline"
//           >
//             Tạo ngay kế hoạch đầu tiên <ChevronRight className="size-4" />
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-8">
//           {plans.map(plan => (
//             <div key={plan.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
//               {/* Plan Header */}
//               <div className="bg-gradient-to-r from-green-50 to-white px-8 py-6 border-b border-gray-50 flex items-center justify-between">
//                 <div className="flex items-center gap-6">
//                   <div className="size-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary border border-green-50">
//                     <Calendar className="size-8" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{plan.planName}</h2>
//                     <div className="flex items-center gap-4 mt-1">
//                       <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
//                         <Clock className="size-3" /> {new Date(plan.startDate).toLocaleDateString('vi-VN')} - {new Date(plan.endDate).toLocaleDateString('vi-VN')}
//                       </span>
//                       {plan.goal && (
//                         <span className="text-xs font-bold text-primary background-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
//                           <Target className="size-3" /> {plan.goal}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => { setSelectedPlanId(plan.id); setShowAddMealModal(true); }}
//                     className="p-2 text-gray-400 hover:text-primary transition-colors"
//                     title="Thêm bữa ăn"
//                   >
//                     <PlusCircle className="size-6" />
//                   </button>
//                   <button
//                     onClick={() => handleDeletePlan(plan.id)}
//                     className="p-2 text-gray-400 hover:text-red-500 transition-colors"
//                   >
//                     <Trash2 className="size-6" />
//                   </button>
//                 </div>
//               </div>

//               {/* Plan Body - Meals List */}
//               <div className="p-8">
//                 {plan.items && plan.items.length > 0 ? (
//                   <div className="space-y-4">
//                     {plan.items.sort((a, b) => a.mealTime.localeCompare(b.mealTime)).map(item => (
//                       <div key={item.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${item.completed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 hover:border-primary/30 shadow-sm'}`}>
//                         <div className="flex items-center gap-4">
//                           <div className={`size-10 rounded-xl flex items-center justify-center ${item.completed ? 'bg-gray-200 text-gray-400' : 'bg-green-50 text-primary'}`}>
//                             <Utensils className="size-5" />
//                           </div>
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.mealTime}</span>
//                               <h4 className={`text-sm font-extrabold ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{item.mealName}</h4>
//                             </div>
//                             {item.productName && (
//                               <p className="text-[11px] text-primary font-bold mt-0.5 italic">Gợi ý: {item.productName}</p>
//                             )}
//                             {item.description && (
//                               <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           {!item.completed && (
//                             <button
//                               onClick={() => handleMarkComplete(item.id)}
//                               className="text-primary hover:text-primary-dark font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5"
//                             >
//                               Hoàn thành <CheckCircle2 className="size-4" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDeleteMeal(item.id)}
//                             className="text-gray-300 hover:text-red-500 transition-colors"
//                           >
//                             <X className="size-4" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="py-10 text-center">
//                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Chưa có bữa ăn nào trong kế hoạch này</p>
//                     <button
//                       onClick={() => { setSelectedPlanId(plan.id); setShowAddMealModal(true); }}
//                       className="mt-4 text-primary font-black text-xs uppercase underline"
//                     >
//                       Thêm bữa ăn đầu tiên
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Create Plan Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
//           <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur">
//               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Tạo kế hoạch mới</h3>
//               <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                 <X className="size-5 text-gray-400" />
//               </button>
//             </div>
//             <form onSubmit={handleCreatePlan} className="p-8 space-y-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Tên kế hoạch</label>
//                 <input
//                   required
//                   type="text"
//                   value={newPlan.planName}
//                   onChange={(e) => setNewPlan({ ...newPlan, planName: e.target.value })}
//                   className="w-full bg-gray-50 border-none rounded-2xl h-12 px-5 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
//                   placeholder="Ví dụ: Giảm cân tháng 3"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Loại kế hoạch</label>
//                   <select
//                     value={newPlan.planType}
//                     onChange={(e) => setNewPlan({ ...newPlan, planType: e.target.value as any })}
//                     className="w-full bg-gray-50 border-none rounded-2xl h-12 px-5 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
//                   >
//                     <option value="DAILY">Hàng ngày (DAILY)</option>
//                     <option value="WEEKLY">Hàng tuần (WEEKLY)</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Ngân sách dự kiến</label>
//                   <input
//                     required
//                     type="number"
//                     value={newPlan.targetBudget}
//                     onChange={(e) => setNewPlan({ ...newPlan, targetBudget: Number(e.target.value) })}
//                     className="w-full bg-gray-50 border-none rounded-2xl h-12 px-5 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
//                     placeholder="VND"
//                   />
//                 </div>
//               </div>
//               <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 text-sm uppercase tracking-widest mt-4">
//                 XÁC NHẬN TẠO
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add Meal Modal */}
//       {showAddMealModal && (
//         <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
//           <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
//               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Thêm bữa ăn</h3>
//               <button onClick={() => setShowAddMealModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                 <X className="size-5 text-gray-400" />
//               </button>
//             </div>
//             <form onSubmit={handleAddMeal} className="p-8 space-y-6">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Tên bữa ăn</label>
//                 <input
//                   required
//                   type="text"
//                   value={newMeal.mealName}
//                   onChange={(e) => setNewMeal({ ...newMeal, mealName: e.target.value })}
//                   className="w-full bg-gray-50 border-none rounded-2xl h-12 px-5 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
//                   placeholder="Ví dụ: Bữa sáng nhẹ"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Giờ ăn</label>
//                   <input
//                     required
//                     type="time"
//                     value={newMeal.mealTime}
//                     onChange={(e) => setNewMeal({ ...newMeal, mealTime: e.target.value })}
//                     className="w-full bg-gray-50 border-none rounded-2xl h-12 px-5 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Gợi ý sản phẩm</label>
//                   <select
//                     value={newMeal.productIds[0] || ''}
//                     onChange={(e) => setNewMeal({ ...newMeal, productIds: e.target.value ? [parseInt(e.target.value)] : [] })}
//                     className="w-full bg-gray-50 border-none rounded-2xl h-12 px-5 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
//                   >
//                     <option value="">-- Chọn sản phẩm --</option>
//                     {availableProducts.map(p => (
//                       <option key={p.id} value={p.id}>{p.productName}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Mô tả thêm</label>
//                 <textarea
//                   value={newMeal.description}
//                   onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
//                   className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px]"
//                   placeholder="Ghi chú: Nấu với ít dầu..."
//                 />
//               </div>
//               <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 text-sm uppercase tracking-widest mt-4">
//                 THÊM VÀO KẾ HOẠCH
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MealPlan;
