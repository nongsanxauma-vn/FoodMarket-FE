import React, { useEffect, useState } from "react";
import { ChevronLeft, Loader2, Share2, Bookmark, Calendar, User, AlertCircle } from "lucide-react";
import { blogService, BlogResponse } from "../../services";

interface NewsDetailProps {
  blogId: number;
  onBack: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ blogId, onBack }) => {
  const [blog, setBlog] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`[NewsDetail] Fetching blog with ID: ${blogId}`);
        
        const res = await blogService.getBlogById(blogId);
        
        console.log(`[NewsDetail] API Response:`, res);
        
        if (res.result) {
          setBlog(res.result);
          console.log(`[NewsDetail] Blog loaded successfully:`, res.result);
        } else {
          console.error(`[NewsDetail] No result in response:`, res);
          setError("Không tìm thấy bài viết");
        }
      } catch (err: any) {
        console.error("Fetch blog detail failed:", err);
        
        // Xử lý các loại lỗi khác nhau
        if (err.status === 404) {
          setError("Bài viết không tồn tại");
        } else if (err.status === 401) {
          setError("Bạn cần đăng nhập để xem bài viết này");
        } else if (err.status === 403) {
          setError("Bạn không có quyền xem bài viết này");
        } else if (err.message === 'Request timeout') {
          setError("Kết nối quá chậm, vui lòng thử lại");
        } else {
          setError("Lỗi khi tải bài viết. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    } else {
      setError("ID bài viết không hợp lệ");
      setLoading(false);
    }
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <Loader2 className="animate-spin text-[#63b34a]" size={48} />
        <p className="text-gray-600 font-medium">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6 px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="text-red-500" size={64} />
          <h2 className="text-2xl font-black text-gray-900">Oops!</h2>
          <p className="text-lg font-bold text-gray-600 max-w-md">
            {error || "Không tìm thấy bài viết"}
          </p>
          <p className="text-sm text-gray-500">
            ID bài viết: {blogId}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-[#63b34a] text-white rounded-2xl font-black hover:bg-green-700 transition-all"
          >
            Quay lại danh sách
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-50">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="size-11 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ChevronLeft className="size-5" />
          </button>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Chi tiết bài viết</h1>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6">
        {/* Featured Image */}
        <div className="mt-12 mb-12">
          <div className="relative aspect-[21/9] w-full rounded-[40px] overflow-hidden shadow-lg border border-gray-100">
            <img
              src={blog.pictureUrl || `https://picsum.photos/seed/news${blog.id}/1200/400`}
              className="w-full h-full object-cover"
              alt={blog.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
              <div className="max-w-full">
                <div className="flex items-center gap-4 text-[10px] font-black text-white/80 uppercase tracking-widest mb-4 flex-wrap">
                  <span className="px-3 py-1 bg-[#63b34a] text-white rounded-lg">Nhà nông</span>
                  <span className="flex items-center gap-2">
                    <Calendar className="size-3" />
                    {new Date(blog.createAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="size-3" />
                    {blog.adminName}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
                  {blog.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-12 md:p-20 mb-12">
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>

        {/* Article Footer with Actions */}
        <div className="bg-gray-50 rounded-[40px] border border-gray-100 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chia sẻ bài viết</span>
            <p className="text-sm font-bold text-gray-600">Giúp bạn bè biết về bài viết này</p>
          </div>
          <div className="flex gap-4">
            <button className="size-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:text-[#63b34a] hover:border-[#63b34a] transition-all shadow-sm">
              <Share2 className="size-5" />
            </button>
            <button className="size-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:text-[#63b34a] hover:border-[#63b34a] transition-all shadow-sm">
              <Bookmark className="size-5" />
            </button>
          </div>
        </div>

        {/* Back to News Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-[#63b34a] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 active:scale-95"
          >
            Quay lại danh sách tin tức
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
