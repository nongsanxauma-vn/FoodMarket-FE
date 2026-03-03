import { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, ArrowDownRight, MoreVertical, Calendar, Bell, History, Loader2, AlertCircle } from 'lucide-react';
import { walletService, WalletResponse, WithdrawRequestResponse } from '../../services';

const Wallet: React.FC = () => {
   const [wallet, setWallet] = useState<WalletResponse | null>(null);
   const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequestResponse[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Withdraw Modal State
   const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
   const [withdrawAmount, setWithdrawAmount] = useState('');
   const [withdrawReason, setWithdrawReason] = useState('');
   const [bankName, setBankName] = useState('MB Bank'); // Default for demo, can be empty
   const [bankAccount, setBankAccount] = useState('');
   const [bankHolder, setBankHolder] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setIsLoading(true);
            const [walletRes, withdrawRes] = await Promise.all([
               walletService.getMyWallet(),
               walletService.getMyWithdrawRequests()
            ]);

            if (walletRes.result) setWallet(walletRes.result);
            if (withdrawRes.result) setWithdrawRequests(withdrawRes.result);
         } catch (err) {
            console.error('Failed to fetch wallet data:', err);
            setError('Không thể tải thông tin ví. Vui lòng thử lại sau.');
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();
   }, []);

   const handleWithdrawSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const amountNum = Number(withdrawAmount);
      if (!amountNum || amountNum <= 0) {
         alert('Vui lòng nhập số tiền hợp lệ');
         return;
      }
      if (wallet && amountNum > wallet.totalBalance) {
         alert('Số tiền rút vượt quá số dư khả dụng');
         return;
      }

      setIsSubmitting(true);
      try {
         const res = await walletService.createWithdrawRequest({
            amount: amountNum,
            reason: withdrawReason,
            bankName: bankName,
            bankAccountNumber: bankAccount,
            bankAccountHolder: bankHolder,
         });

         if (res.result) {
            alert('Đã gửi yêu cầu rút tiền thành công!');
            setIsWithdrawModalOpen(false);
            setWithdrawAmount('');
            setWithdrawReason('');
            // Reload requests
            const withdrawRes = await walletService.getMyWithdrawRequests();
            if (withdrawRes.result) setWithdrawRequests(withdrawRes.result);
         }
      } catch (err: any) {
         alert(err?.data?.message || 'Có lỗi xảy ra khi tạo yêu cầu rút tiền');
      } finally {
         setIsSubmitting(false);
      }
   };

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu tài chính...</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-black font-display text-gray-900">Ví Tiền & Tài Chính</h2>
               <p className="text-gray-400 font-medium text-sm mt-1">Quản lý thu nhập và theo dõi lịch sử yêu cầu rút tiền.</p>
            </div>
            <div className="flex items-center gap-4">
               <button className="size-11 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 relative shadow-sm">
                  <Bell className="size-5" />
                  <span className="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white rounded-full"></span>
               </button>
               <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-800">{new Date().toLocaleDateString('vi-VN')}</span>
                  <Calendar className="size-4 text-primary" />
               </div>
            </div>
         </div>

         {error && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-bold">
               <AlertCircle className="size-6" />
               {error}
            </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Wallet View */}
            <div className="lg:col-span-3 flex flex-col gap-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 p-8 sm:p-10 bg-gradient-to-br from-primary to-primary-dark rounded-[40px] text-white shadow-xl shadow-primary/20 relative overflow-hidden group min-h-[280px] flex flex-col justify-center">
                     <div className="relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-widest text-white/70">Số dư khả dụng</p>
                        <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-2 mb-8">
                           <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-none">
                              {(wallet?.totalBalance || 0).toLocaleString('vi-VN')}
                           </h3>
                           <span className="text-lg sm:text-xl font-bold text-white/60">VND</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                              <p className="text-[10px] font-bold text-white/60 uppercase">Tổng doanh thu</p>
                              <p className="text-base sm:text-lg font-black mt-1">{(wallet?.totalRevenueAllTime || 0).toLocaleString('vi-VN')}đ</p>
                           </div>
                           <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                              <p className="text-[10px] font-bold text-white/60 uppercase">Đã rút tiền</p>
                              <p className="text-base sm:text-lg font-black mt-1">{(wallet?.totalWithdrawn || 0).toLocaleString('vi-VN')}đ</p>
                           </div>
                        </div>
                     </div>
                     <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                     <div className="absolute bottom-10 right-10 size-16 bg-white/10 rounded-2xl transform rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                  </div>

                  <div className="flex flex-col gap-6">
                     <div className="flex-1 p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                           <div className="size-12 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
                              <Landmark className="size-6" />
                           </div>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">VÍ HOA HỒNG (COM)</p>
                        </div>
                        <div className="mt-4">
                           <h4 className="text-xl sm:text-2xl font-black text-primary truncate">{(wallet?.commissionWallet || 0).toLocaleString('vi-VN')} <span className="text-sm font-bold opacity-60">VND</span></h4>
                           <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Số tiền hoa hồng từ hệ thống.</p>
                        </div>
                     </div>
                     <div className="flex-1 p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                           <div className="size-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
                              <span className="material-symbols-outlined text-3xl">lock</span>
                           </div>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SỐ DƯ TẠM GIỮ 🔒</p>
                        </div>
                        <div className="mt-4">
                           <h4 className="text-xl sm:text-2xl font-black text-yellow-600 truncate">{(wallet?.frozenBalance || 0).toLocaleString('vi-VN')} <span className="text-sm font-bold opacity-60">VND</span></h4>
                           <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                              <div className="h-full bg-yellow-400" style={{ width: wallet?.frozenBalance ? '30%' : '0%' }} />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-10 py-4 border-b border-gray-50 flex items-center gap-12">
                     <button className="py-4 text-xs font-black text-primary border-b-2 border-primary flex items-center gap-2">
                        <History className="size-4" /> Lịch sử rút tiền
                     </button>
                  </div>

                  <div className="p-8">
                     <div className="flex items-center justify-between mb-8">
                        <h4 className="flex items-center gap-3 font-black text-gray-800 uppercase tracking-tight">
                           <span className="material-symbols-outlined text-primary">payments</span> Các yêu cầu rút tiền gần đây
                        </h4>
                        <button className="px-4 py-2 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 flex items-center gap-2 hover:bg-gray-50 uppercase tracking-widest">
                           <ArrowDownRight className="size-3 rotate-45" /> Tải báo cáo
                        </button>
                     </div>

                     <div className="space-y-4">
                        {withdrawRequests.length === 0 ? (
                           <div className="p-20 text-center flex flex-col items-center gap-4">
                              <History className="size-12 text-gray-100" />
                              <p className="text-gray-400 font-bold">Chưa có yêu cầu rút tiền nào.</p>
                           </div>
                        ) : (
                           withdrawRequests.map((item) => (
                              <div key={item.id} className="group p-6 hover:bg-gray-50/50 rounded-3xl border border-transparent hover:border-gray-100 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
                                 <div className="flex-1 grid grid-cols-2 md:grid-cols-4 items-center gap-4 md:gap-8 w-full">
                                    <div className="flex flex-col gap-1">
                                       <p className="text-sm font-black text-gray-900">Yêu cầu #{item.id}</p>
                                       <p className="text-[10px] text-gray-400 font-medium line-clamp-1">{item.reason || 'Rút tiền thu nhập'}</p>
                                    </div>
                                    <div className="text-left md:text-center">
                                       <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${item.status === 'SUCCESS' ? 'bg-green-50 text-primary' :
                                          item.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-400'
                                          }`}>
                                          {item.status}
                                       </span>
                                    </div>
                                    <div className="text-right flex-1 flex flex-col items-end">
                                       <p className="text-sm font-black text-gray-900">-{item.amount.toLocaleString('vi-VN')}đ</p>
                                       <p className="text-[10px] text-gray-400 font-bold">{item.processedAt ? new Date(item.processedAt).toLocaleDateString('vi-VN') : 'Đang duyệt'}</p>
                                    </div>
                                 </div>
                                 <button className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center ml-4">
                                    <MoreVertical className="size-4 text-gray-400" />
                                 </button>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-6">
               <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tài khoản ngân hàng</h4>
                  <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                     <div className="size-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                        <Landmark className="size-5" />
                     </div>
                     <div className="flex-1">
                        <p className="text-xs font-black text-gray-900 uppercase">MB BANK</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hỗ trợ thanh toán nhanh</p>
                     </div>
                  </div>
                  <button
                     onClick={() => setIsWithdrawModalOpen(true)}
                     className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all">
                     Rút tiền ngay
                  </button>
               </div>
            </div>
         </div>

         {/* Withdraw Request Modal */}
         {isWithdrawModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                  <button
                     onClick={() => setIsWithdrawModalOpen(false)}
                     className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
                  >
                     <span className="material-symbols-outlined">close</span>
                  </button>

                  <div className="mb-6">
                     <h3 className="text-2xl font-black font-display text-gray-900 mb-1">Tạo Yêu Cầu Rút Tiền</h3>
                     <p className="text-sm text-gray-500">Số dư khả dụng: <span className="font-bold text-primary">{(wallet?.totalBalance || 0).toLocaleString('vi-VN')}đ</span></p>
                  </div>

                  <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2">Số tiền cần rút (VNĐ) *</label>
                        <input
                           type="number"
                           value={withdrawAmount}
                           onChange={(e) => setWithdrawAmount(e.target.value)}
                           className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                           placeholder="Nhập số tiền..."
                           required
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2">Lý do rút tiền</label>
                        <input
                           type="text"
                           value={withdrawReason}
                           onChange={(e) => setWithdrawReason(e.target.value)}
                           className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                           placeholder="Ví dụ: Rút tiền thu nhập tháng 10"
                        />
                     </div>
                     <div className="pt-4 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Thông tin nhận tiền (Tùy chọn)</p>
                        <div className="space-y-3">
                           <input
                              type="text"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                              placeholder="Tên ngân hàng (VD: MB Bank, Vietcombank)"
                           />
                           <input
                              type="text"
                              value={bankAccount}
                              onChange={(e) => setBankAccount(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                              placeholder="Số tài khoản"
                           />
                           <input
                              type="text"
                              value={bankHolder}
                              onChange={(e) => setBankHolder(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm uppercase"
                              placeholder="Tên chủ tài khoản"
                           />
                        </div>
                     </div>

                     <div className="pt-6">
                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:bg-primary-dark transition-all disabled:opacity-50"
                        >
                           {isSubmitting ? 'Đang xử lý...' : 'XÁC NHẬN RÚT TIỀN'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

// Add fix: Export default
export default Wallet;
