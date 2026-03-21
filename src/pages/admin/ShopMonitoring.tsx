
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Search, Filter, History, Lock, Bell, ChevronRight, Star, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { userService, UserResponse } from '../../services';
import Pagination, { PageInfo } from '../../components/ui/Pagination';
import { globalShowAlert, globalShowConfirm } from '../../contexts/PopupContext';

const PAGE_SIZE = 10;

const ShopMonitoring: React.FC = () => {
   const [shops, setShops] = useState<UserResponse[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [page, setPage] = useState(0);
   const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

   useEffect(() => {
      const fetchShops = async () => {
         setLoading(true);
         try {
            const res = await userService.getAllUsersPaged(page, PAGE_SIZE);
            const allUsers = res.result?.content || [];
            if (res.result) {
               setPageInfo({
                  page: res.result.page,
                  size: res.result.size,
                  totalElements: res.result.totalElements,
                  totalPages: res.result.totalPages,
                  first: res.result.first,
                  last: res.result.last,
               });
            }
            const shopOwners = allUsers.filter((u: UserResponse) => u.role?.name === 'SHOP_OWNER' || u.role?.name === 'FARMER');
            setShops(shopOwners);
         } catch (err) {
            console.error('Failed to load shops', err);
            setError('Không thể tải danh sách cửa hàng.');
         } finally {
            setLoading(false);
         }
      };
      fetchShops();
   }, [page]);

   const handleDeactivate = async (userId: number) => {
      if (!await globalShowConfirm('Xác nhận', 'Bạn có chắc muốn khóa tạm thời cửa hàng này?')) return;
      try {
         await userService.deactivateUser(userId);
         setShops(prev => prev.map(s => s.id === userId ? { ...s, status: 'DEACTIVATED' } : s));
      } catch (err: any) {
         globalShowAlert(err?.data?.message || 'Không thể khóa cửa hàng', 'Lỗi', 'error');
      }
   };

   const handleActivate = async (userId: number) => {
      try {
         await userService.activateUser(userId);
         setShops(prev => prev.map(s => s.id === userId ? { ...s, status: 'ACTIVE' } : s));
      } catch (err: any) {
         globalShowAlert(err?.data?.message || 'Không thể mở khóa cửa hàng', 'Lỗi', 'error');
      }
   };

   const filteredShops = shops.filter(s => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (s.shopName || '').toLowerCase().includes(term) ||
         (s.fullName || '').toLowerCase().includes(term) ||
         (s.email || '').toLowerCase().includes(term);
   });

   const inactiveShops = shops.filter(s => s.status === 'DEACTIVATED' || s.status === 'INACTIVE');

   if (loading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải danh sách cửa hàng...</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
         {/* Warning cards for inactive shops */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {inactiveShops.length > 0 ? inactiveShops.slice(0, 2).map((shop, i) => (
               <div key={shop.id} className={`${i === 0 ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'} border rounded-[40px] p-10 flex flex-col justify-between group overflow-hidden relative`}>
                  <div className="flex items-start gap-4 relative z-10">
                     <div className={`size-12 ${i === 0 ? 'bg-red-500' : 'bg-orange-500'} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                        {i === 0 ? <AlertTriangle className="size-6" /> : <Bell className="size-6" />}
                     </div>
                     <div className="flex-1">
                        <h3 className={`text-xl font-black ${i === 0 ? 'text-red-900' : 'text-orange-900'} leading-tight`}>
                           {i === 0 ? 'CẢNH BÁO: SHOP BỊ KHÓA' : 'ĐANG THEO DÕI CHẶT CHẼ'}
                        </h3>
                     </div>
                  </div>
                  <div className="mt-8 bg-white/50 backdrop-blur rounded-[32px] border border-gray-100 p-8 relative z-10">
                     <div className="flex items-center justify-between mb-4">
                        <h4 className="font-black text-gray-900">{shop.shopName || shop.fullName || 'Shop N/A'}</h4>
                        <span className={`text-xs font-black ${i === 0 ? 'text-red-500' : 'text-orange-500'}`}>{shop.status}</span>
                     </div>
                     <div className="flex items-center justify-between mt-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email: {shop.email}</span>
                        <button onClick={() => handleActivate(shop.id)} className="px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl hover:bg-blue-100 transition-colors">Mở khóa</button>
                     </div>
                  </div>
               </div>
            )) : (
               <div className="col-span-2 bg-green-50 border border-green-100 rounded-[40px] p-10 text-center">
                  <p className="text-green-700 font-bold">✅ Tất cả cửa hàng đang hoạt động bình thường</p>
               </div>
            )}
         </div>

         {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
               <AlertCircle className="size-5" /> {error}
            </div>
         )}

         {/* Shop Table */}
         <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <Filter className="size-5 text-gray-400" />
                  <h4 className="font-black text-gray-800 uppercase tracking-tight">Danh sách cửa hàng ({filteredShops.length})</h4>
               </div>
               <div className="relative w-full max-w-sm">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm tên shop, chủ shop..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                     <tr>
                        <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cửa hàng</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chủ shop</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Email</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                        <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Hành động</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {filteredShops.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="px-10 py-10 text-center text-gray-400 font-bold">Không tìm thấy cửa hàng nào.</td>
                        </tr>
                     ) : filteredShops.map((shop, i) => (
                        <tr key={shop.id} className="hover:bg-gray-50/30 transition-colors">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="size-10 bg-gray-50 rounded-2xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">storefront</span>
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-gray-900">{shop.shopName || 'Shop N/A'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {shop.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-6">
                              <div className="flex items-center gap-3">
                                 <img src={shop.logoUrl || `https://picsum.photos/seed/o${i}/60/60`} className="size-8 rounded-full object-cover" />
                                 <span className="text-xs font-bold text-gray-700">{shop.fullName || 'N/A'}</span>
                              </div>
                           </td>
                           <td className="px-6 py-6 text-center text-xs font-bold text-gray-600">{shop.email || 'N/A'}</td>
                           <td className="px-6 py-6 text-center">
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${shop.status === 'ACTIVE' ? 'bg-green-50 text-green-600' :
                                 shop.status === 'DEACTIVATED' || shop.status === 'INACTIVE' ? 'bg-red-50 text-red-500' :
                                    'bg-orange-50 text-orange-500'
                                 }`}>
                                 {shop.status === 'ACTIVE' ? 'Hoạt động' :
                                  shop.status === 'DEACTIVATED' ? 'Đã khóa' :
                                  shop.status === 'INACTIVE' ? 'Tạm ngưng' :
                                  shop.status || 'N/A'}
                              </span>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 {shop.status === 'ACTIVE' ? (
                                    <button onClick={() => handleDeactivate(shop.id)} className="px-6 py-2.5 bg-red-50 text-red-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-red-100 transition-colors">Khóa tạm thời</button>
                                 ) : (
                                    <button onClick={() => handleActivate(shop.id)} className="px-6 py-2.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-100 transition-colors">Mở khóa</button>
                                 )}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <div className="p-10 bg-white border-t border-gray-50 flex items-center justify-between">
               <p className="text-[10px] text-gray-400 font-bold italic">
                  * Hiển thị {filteredShops.length} cửa hàng.
               </p>
            </div>
            {pageInfo && <Pagination pageInfo={pageInfo} onPageChange={(p) => { setPage(p); }} className="px-10" />}
         </div>
      </div>
   );
};

export default ShopMonitoring;
