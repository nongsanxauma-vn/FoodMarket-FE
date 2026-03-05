import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Search, Filter, Edit3, Trash2, Eye, Calendar, User, Clock, CheckCircle2, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import { blogService, BlogResponse, BlogCreationRequest } from '../../services';
import MyCKEditor from '../../components/MyCKEditor';

const NewsManagement: React.FC = () => {
   const [blogs, setBlogs] = useState<BlogResponse[]>([]);
   const [loading, setLoading] = useState(true);
   const [isAddingNew, setIsAddingNew] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // Form state
   const [title, setTitle] = useState('');
   const [content, setContent] = useState('');
   const [status, setStatus] = useState('DRAFT');
   const [selectedImage, setSelectedImage] = useState<File | null>(null);
   const [imagePreview, setImagePreview] = useState<string | null>(null);
   const [submitting, setSubmitting] = useState(false);

   // View/Edit state
   const [isViewing, setIsViewing] = useState(false);
   const [selectedBlog, setSelectedBlog] = useState<BlogResponse | null>(null);

   useEffect(() => {
      fetchBlogs();
   }, []);

   const fetchBlogs = async () => {
      try {
         setLoading(true);
         const response = await blogService.getAllBlogs();
         if (response.result) {
            setBlogs(response.result);
         }
      } catch (err) {
         console.error('Failed to fetch blogs', err);
         setError('Không thể tải danh sách bài viết.');
      } finally {
         setLoading(false);
      }
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         const file = e.target.files[0];
         setSelectedImage(file);
         setImagePreview(URL.createObjectURL(file));
      }
   };

   const handleCreateBlog = async () => {
      if (!title || !content) {
         alert('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
         return;
      }

      setSubmitting(true);
      try {
         const request: BlogCreationRequest = {
            title,
            content,
            status,
         };
         const response = await blogService.createBlog(request, selectedImage || undefined);
         if (response.result) {
            setIsAddingNew(false);
            fetchBlogs();
            // Reset form
            setTitle('');
            setContent('');
            setSelectedImage(null);
            setImagePreview(null);
         }
      } catch (err) {
         console.error('Failed to create blog', err);
         alert('Đăng bài thất bại. Vui lòng thử lại.');
      } finally {
         setSubmitting(false);
      }
   };

   const handleDeleteBlog = async (id: number) => {
      if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
         return;
      }

      try {
         await blogService.deleteBlog(id);
         setBlogs(blogs.filter(b => b.id !== id));
         alert('Đã xóa bài viết thành công.');
      } catch (err) {
         console.error('Failed to delete blog', err);
         alert('Xóa bài viết thất bại.');
      }
   };

   const handleToggleStatus = async (blog: BlogResponse) => {
      const newStatus = blog.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      try {
         await blogService.updateBlog(blog.id, {
            title: blog.title,
            content: blog.content,
            status: newStatus
         });
         setBlogs(blogs.map(b => b.id === blog.id ? { ...b, status: newStatus } : b));
      } catch (err) {
         console.error('Failed to update blog status', err);
         alert('Đổi trạng thái thất bại.');
      }
   };

   const handleViewBlog = (blog: BlogResponse) => {
      setSelectedBlog(blog);
      setIsViewing(true);
   };

   if (isAddingNew) {
      return (
         <div className="flex flex-col gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center gap-6">
               <button onClick={() => setIsAddingNew(false)} className="size-11 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                  <ChevronLeft className="size-5" />
               </button>
               <div>
                  <h2 className="text-3xl font-black font-display text-gray-900 uppercase tracking-tight">Viết bài mới</h2>
                  <p className="text-gray-400 font-medium text-sm mt-1">Sáng tạo nội dung hữu ích cho cộng đồng XẤU MÃ.</p>
               </div>
               <div className="flex gap-4 ml-auto">
                  <button
                     onClick={handleCreateBlog}
                     disabled={submitting}
                     className="px-8 py-3 bg-primary text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 disabled:bg-gray-300"
                  >
                     {submitting ? 'Đang đăng...' : 'Đăng bài ngay'}
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 flex flex-col gap-8">
                  <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 space-y-8">
                     <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề bài viết</label>
                        <input
                           type="text"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           placeholder="Ví dụ: Hành trình giải cứu 10 tấn cam sành..."
                           className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
                        />
                     </div>
                     <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung bài viết</label>
                        <MyCKEditor 
                           value={content}
                           onChange={setContent}
                           placeholder="Viết nội dung tại đây..."
                        />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-8">
                  <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 space-y-8">
                     <h4 className="font-black text-gray-800 uppercase tracking-tight">Thiết lập xuất bản</h4>
                     <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Trạng thái</label>
                        <select
                           value={status}
                           onChange={(e) => setStatus(e.target.value)}
                           className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black text-gray-600 outline-none uppercase tracking-widest"
                        >
                           <option value="DRAFT">Lưu nháp</option>
                           <option value="PUBLISHED">Xuất bản ngay</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Ảnh bìa</label>
                        <div
                           className="aspect-video w-full border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center text-center gap-4 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all relative overflow-hidden group"
                           onClick={() => document.getElementById('blog-image-upload')?.click()}
                        >
                           {imagePreview ? (
                              <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
                           ) : (
                              <>
                                 <Plus className="size-8 text-gray-300" />
                                 <p className="text-[10px] font-black text-gray-400 uppercase">Tải ảnh lên</p>
                              </>
                           )}
                        </div>
                        <input
                           id="blog-image-upload"
                           type="file"
                           className="hidden"
                           accept="image/*"
                           onChange={handleImageChange}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (isViewing && selectedBlog) {
      return (
         <div className="flex flex-col gap-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center gap-6">
               <button onClick={() => setIsViewing(false)} className="size-11 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                  <ChevronLeft className="size-5" />
               </button>
               <div>
                  <h2 className="text-3xl font-black font-display text-gray-900 uppercase tracking-tight">Chi tiết bài viết</h2>
                  <p className="text-gray-400 font-medium text-sm mt-1">Xem lại nội dung đã xuất bản.</p>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
               <div className="aspect-[21/9] w-full relative">
                  <img
                     src={selectedBlog.pictureUrl || `https://picsum.photos/seed/news${selectedBlog.id}/1200/400`}
                     className="w-full h-full object-cover"
                     alt="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                     <div className="max-w-4xl">
                        <div className="flex items-center gap-4 text-[10px] font-black text-white/80 uppercase tracking-widest mb-4">
                           <span className="px-3 py-1 bg-primary text-white rounded-lg">Nhà nông</span>
                           <span>{new Date(selectedBlog.createAt).toLocaleDateString('vi-VN')}</span>
                           <span>Bởi: {selectedBlog.adminName}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">{selectedBlog.title}</h1>
                     </div>
                  </div>
               </div>
               <div className="p-12 md:p-20">
                  <div className="prose prose-lg max-w-none">
                     <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                        {selectedBlog.content}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-black font-display text-gray-900 uppercase tracking-tight">Quản lý tin tức</h2>
               <p className="text-gray-400 font-medium text-sm mt-1">Quản lý nội dung bài viết, cẩm nang và tin tức nông sản trên hệ thống.</p>
            </div>
            <button onClick={() => setIsAddingNew(true)} className="px-8 py-3 bg-primary text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95">
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
                     {loading ? (
                        <tr>
                           <td colSpan={6} className="px-10 py-20 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Đang tải bài viết...</td>
                        </tr>
                     ) : blogs.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-10 py-20 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Chưa có bài viết nào</td>
                        </tr>
                     ) : (
                        blogs.map((art) => (
                           <tr key={art.id} className="hover:bg-gray-50/30 transition-colors group">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="size-12 bg-gray-100 rounded-xl overflow-hidden shadow-sm shrink-0">
                                       <img src={art.pictureUrl || `https://picsum.photos/seed/news${art.id}/80/80`} className="w-full h-full object-cover" alt="thumb" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-black text-gray-900 line-clamp-1">{art.title}</p>
                                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ngày đăng: {new Date(art.createAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-6">
                                 <span className="px-3 py-1 bg-green-50 text-primary text-[10px] font-black rounded-lg uppercase tracking-tight">
                                    Nhà nông
                                 </span>
                              </td>
                              <td className="px-6 py-6 text-center">
                                 <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-gray-600">{art.adminName}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-6 text-center">
                                 <div className="flex items-center justify-center gap-1.5 text-gray-400">
                                    <Eye className="size-3" />
                                    <span className="text-xs font-bold">0</span>
                                 </div>
                              </td>
                              <td className="px-6 py-6 text-center">
                                 <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${art.status === 'PUBLISHED' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 bg-gray-50'}`}>
                                    {art.status === 'PUBLISHED' ? 'Đã đăng' : 'Bản nháp'}
                                 </span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                       title="Đổi trạng thái"
                                       onClick={() => handleToggleStatus(art)}
                                       className="size-9 bg-gray-50 text-orange-500 rounded-xl flex items-center justify-center hover:bg-orange-50 transition-colors"
                                    >
                                       <RefreshCcw className="size-4" />
                                    </button>
                                    <button
                                       onClick={() => handleViewBlog(art)}
                                       className="size-9 bg-gray-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors"
                                    >
                                       <Eye className="size-4" />
                                    </button>
                                    <button
                                       onClick={() => handleDeleteBlog(art.id)}
                                       className="size-9 bg-gray-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors"
                                    >
                                       <Trash2 className="size-4" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>

            <div className="p-10 bg-white border-t border-gray-50 flex items-center justify-between">
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
                  <h4 className="text-2xl font-black uppercase tracking-tight leading-tight">Mẹo viết tiêu đề <br />thu hút người mua</h4>
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
