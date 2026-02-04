
import React from 'react';
import { Newspaper, Plus, Search, Filter, Edit3, Trash2, Eye, Calendar, User, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const NewsManagement: React.FC = () => {
  const articles = [
    { id: 1, title: 'Hành trình giải cứu 10 tấn cam sành Vĩnh Long', category: 'Nhà nông', author: 'Admin', date: '24/10/2023', status: 'Hiển thị', views: '1.2k', color: 'text-emerald-600 bg-emerald-50' },
    { id: 2, title: 'Tại sao nông sản "xấu mã" lại chứa nhiều dinh dưỡng?', category: 'Sức khỏe', author: 'Admin', date: '22/10/2023', status: 'Hiển thị', views: '850', color: 'text-emerald-600 bg-emerald-50' },
    { id: 3, title: '5 công thức món ngon từ cà rốt hữu cơ dập nhẹ', category: 'Cẩm nang', author: 'ChefX', date: '20/10/2023', status: 'Nháp', views: '0', color: 'text-gray-400 bg-gray-50' },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900 uppercase tracking-tight">Quản lý tin tức</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Quản lý nội dung bài viết, cẩm nang và tin tức nông sản trên hệ thống.</p>
        </div>
        <button className="px-8 py-3 bg-primary text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95">
          <Plus className="size-5" /> Viết bài mới
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-6 flex-1 max-w-2xl">
              <div className="relative flex-1">
                 <input type="text" placeholder="Tìm kiếm bài viết..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
              </div>
              <select className="px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black text-gray-600 outline-none uppercase tracking-widest cursor-pointer">
                 <option>Tất cả danh mục</option>
                 <option>Nhà nông</option>
                 <option>Sức khỏe</option>
                 <option>Cẩm nang</option>
              </select>
           </div>
           <div className="flex gap-4">
              <button className="size-11 flex items-center justify-center bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition-colors">
                <Filter className="size-5" />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                 <tr>
                    <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bài viết</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Người viết</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Lượt xem</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                    <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {articles.map((art) => (
                   <tr key={art.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-4">
                            <div className="size-12 bg-gray-100 rounded-xl overflow-hidden shadow-sm shrink-0">
                               <img src={`https://picsum.photos/seed/news${art.id}/80/80`} className="w-full h-full object-cover" alt="thumb" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-900 line-clamp-1">{art.title}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ngày đăng: {art.date}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <span className="px-3 py-1 bg-green-50 text-primary text-[10px] font-black rounded-lg uppercase tracking-tight">
                           {art.category}
                         </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                         <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-600">{art.author}</span>
                         </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                         <div className="flex items-center justify-center gap-1.5 text-gray-400">
                            <Eye className="size-3" />
                            <span className="text-xs font-bold">{art.views}</span>
                         </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                         <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${art.color}`}>
                           {art.status}
                         </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="size-9 bg-gray-50 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-colors">
                               <Edit3 className="size-4" />
                            </button>
                            <button className="size-9 bg-gray-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors">
                               <Trash2 className="size-4" />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

        <div className="p-10 bg-white border-t border-gray-50 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hiển thị bài viết 1-3 trên tổng số 42 bài</p>
           <div className="flex items-center gap-2">
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-gray-50 transition-colors">
                 <ChevronLeft className="size-5" />
              </button>
              <button className="size-10 bg-primary text-white rounded-2xl flex items-center justify-center text-sm font-black shadow-lg shadow-primary/20">1</button>
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-sm font-black text-gray-400 hover:bg-gray-50 transition-colors">2</button>
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-gray-50 transition-colors">
                 <ChevronRight className="size-5" />
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-[#38703d] rounded-[40px] p-10 text-white flex flex-col justify-between h-64 shadow-xl shadow-green-900/10">
            <div>
               <Newspaper className="size-10 mb-4 opacity-50" />
               <h4 className="text-2xl font-black uppercase tracking-tight leading-tight">Mẹo viết tiêu đề <br/>thu hút người mua</h4>
            </div>
            <button className="w-fit text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-white/30 pb-1 hover:border-white transition-all">Xem cẩm nang Admin</button>
         </div>
         
         <div className="bg-white rounded-[40px] border border-gray-100 p-10 flex flex-col justify-center gap-6 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="size-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="size-8" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">BÀI VIẾT HIỆU QUẢ NHẤT</p>
                  <h4 className="text-lg font-black text-gray-900 leading-tight mt-1">Giải cứu Cam Sành</h4>
               </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic">
                 "Bài viết này đã giúp tăng 150% lượt click vào danh mục Trái Cây trong tuần qua."
               </p>
            </div>
         </div>

         <div className="bg-white rounded-[40px] border border-gray-100 p-10 flex flex-col justify-center gap-4 shadow-sm relative overflow-hidden">
            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Thống kê tháng</h4>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase">Bài mới:</span>
                  <span className="text-lg font-black text-primary">12</span>
               </div>
               <div className="w-full h-1.5 bg-gray-100 rounded-full">
                  <div className="w-[65%] h-full bg-primary rounded-full" />
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase">Tổng views:</span>
                  <span className="text-lg font-black text-gray-900">45,820</span>
               </div>
            </div>
            <div className="absolute -right-4 -bottom-4 size-24 bg-primary/5 rounded-full blur-2xl" />
         </div>
      </div>
    </div>
  );
};

export default NewsManagement;
