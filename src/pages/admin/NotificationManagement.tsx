
import React, { useState } from 'react';
import { Send, Users, User, Sprout, Truck, History, CheckCircle2, Clock, Trash2, ShieldAlert } from 'lucide-react';
import { AppRole } from '../../types/index';

const NotificationManagement: React.FC = () => {
  const [target, setTarget] = useState<string>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const history = [
    { id: 1, title: 'Thông báo bảo trì hệ thống', target: 'Tất cả', time: '14:20, 24/05/2024', status: 'Đã gửi' },
    { id: 2, title: 'Cập nhật chính sách phí sàn mới', target: 'Nông dân', time: '10:00, 22/05/2024', status: 'Đã gửi' },
    { id: 3, title: 'Khuyến mãi hè 50%', target: 'Người mua', time: '18:30, 20/05/2024', status: 'Đã gửi' },
  ];

  const handleSend = () => {
    if (!title || !message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setTitle('');
      setMessage('');
      alert('Thông báo đã được gửi thành công!');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black font-display text-gray-900 uppercase">Quản lý thông báo</h2>
        <p className="text-gray-400 font-medium text-sm mt-1">Gửi thông báo đẩy đến toàn bộ người dùng hoặc các nhóm đối tượng cụ thể.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Composer Section */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-10">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Send className="size-5" />
            </div>
            <h4 className="font-black text-gray-800 uppercase tracking-tight">Soạn thông báo mới</h4>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-4">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Đối tượng nhận</label>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'all', name: 'Tất cả', icon: Users },
                    { id: 'buyer', name: 'Người mua', icon: User },
                    { id: 'farmer', name: 'Nông dân', icon: Sprout },
                    { id: 'shipper', name: 'Shipper', icon: Truck },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTarget(t.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        target === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 text-gray-400 hover:border-gray-100'
                      }`}
                    >
                      <t.icon className="size-5" />
                      <span className="text-[10px] font-black uppercase tracking-tight">{t.name}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề thông báo</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề ngắn gọn..." 
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[24px] text-sm font-black outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung chi tiết</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Nội dung thông báo mà người dùng sẽ thấy..." 
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[24px] text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="bg-orange-50/50 p-6 rounded-[28px] border border-orange-100 flex items-start gap-4">
               <ShieldAlert className="size-5 text-orange-500 shrink-0 mt-0.5" />
               <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
                 Hành động này sẽ gửi thông báo đẩy đến ngay lập tức. Hãy kiểm tra kỹ nội dung trước khi gửi để tránh gây phiền hà cho người dùng.
               </p>
            </div>

            <button 
              onClick={handleSend}
              disabled={sending || !title || !message}
              className={`w-full py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl ${
                sending ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark'
              }`}
            >
              {sending ? 'ĐANG GỬI...' : <><Send className="size-5" /> GỬI THÔNG BÁO NGAY</>}
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="flex flex-col gap-8">
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col gap-8">
              <div className="flex items-center gap-3">
                 <History className="size-5 text-gray-400" />
                 <h4 className="font-black text-gray-800 uppercase tracking-tight">Lịch sử gửi</h4>
              </div>

              <div className="space-y-4">
                 {history.map((h) => (
                   <div key={h.id} className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:border-primary/20 transition-all">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[9px] font-black text-primary uppercase tracking-widest">{h.target}</span>
                         <span className="text-[9px] font-bold text-gray-400">{h.time}</span>
                      </div>
                      <h5 className="text-sm font-black text-gray-900 leading-snug">{h.title}</h5>
                      <div className="flex items-center justify-between mt-4">
                         <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600"><CheckCircle2 className="size-3" /> {h.status}</span>
                         <button className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="size-4" /></button>
                      </div>
                   </div>
                 ))}
              </div>

              <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:underline mx-auto">Xem báo cáo chi tiết</button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default NotificationManagement;
