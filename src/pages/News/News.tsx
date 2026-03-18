import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Search,
  Share2,
  Bookmark,
  Flame,
  Leaf,
  Coffee,
  Heart,
  Loader2,
} from "lucide-react";
import { blogService, BlogResponse } from "../../services";
import NewsDetail from "./NewsDetail";
import Pagination, { PageInfo } from "../../components/ui/Pagination";

const PAGE_SIZE = 9;

const News: React.FC = () => {
  const [articles, setArticles] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  useEffect(() => {
    document.body.style.setProperty("overflow", "auto", "important");
    document.documentElement.style.setProperty("overflow", "auto", "important");

    const fetchBlogs = async () => {
      try {
        const res = await blogService.getPublishedBlogsPaged(page, PAGE_SIZE);
        if (res.result) {
          setArticles(res.result.content);
          setPageInfo({
            page: res.result.page,
            size: res.result.size,
            totalElements: res.result.totalElements,
            totalPages: res.result.totalPages,
            first: res.result.first,
            last: res.result.last,
          });
        }
      } catch (error) {
        console.error("Fetch blogs failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();

    return () => {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    };
  }, [page]);

  const categories = [
    { name: "Xu hướng", icon: Flame, color: "text-orange-500" },
    { name: "Nhà nông", icon: Leaf, color: "text-[#63b34a]" },
    { name: "Sức khỏe", icon: Heart, color: "text-red-500" },
    { name: "Cẩm nang", icon: Coffee, color: "text-amber-600" },
  ];

  // Logic lọc bài viết
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featured = filteredArticles[0];
  const others = filteredArticles.slice(1);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <Loader2 className="animate-spin text-[#63b34a]" size={48} />
      </div>
    );
  }

  // Show detail view if a blog is selected
  if (selectedBlogId !== null) {
    console.log(`[News] Showing detail for blog ID: ${selectedBlogId}`);
    return <NewsDetail blogId={selectedBlogId} onBack={() => {
      console.log(`[News] Returning to news list from blog ID: ${selectedBlogId}`);
      setSelectedBlogId(null);
    }} />;
  }

  return (
    <div className="bg-white min-h-screen font-sans pb-20 overflow-y-auto">
      {/* 1. Header Navigation & Search Bar (Sticky) */}
      <div className="border-b border-gray-50 sticky top-0 z-40 bg-white/90 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Categories */}
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar w-full md:w-auto">
            {categories.map((cat, i) => (
              <button key={i} className="flex items-center gap-2 group whitespace-nowrap">
                <cat.icon className={`size-4 ${cat.color} opacity-90`} />
                <span className="text-[12px] font-black uppercase tracking-[0.1em] text-gray-700 group-hover:text-black transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..." 
              className="w-full pl-12 pr-4 py-3 bg-[#f3f4f6]/50 rounded-full text-xs font-bold outline-none focus:ring-2 focus:ring-[#63b34a]/20 transition-all border border-transparent focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        {/* 2. Featured Article (Tin tiêu điểm) */}
        {featured && (
          <div className="group cursor-pointer py-16" onClick={() => {
            console.log(`[News] Clicked featured article with ID: ${featured.id}`);
            setSelectedBlogId(featured.id);
          }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image Container */}
              <div className="relative aspect-[1.3/1] rounded-[50px] overflow-hidden shadow-sm border border-gray-100">
                <img 
                  src={featured.pictureUrl || "https://images.unsplash.com/photo-1610832958506-aa5633842699?q=80&w=1000&auto=format&fit=crop"} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt={featured.title}
                />
                <div className="absolute top-8 left-8 bg-[#63b34a] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg">
                  Tin tiêu điểm
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col">
                <h1 className="text-[42px] md:text-[52px] font-black text-[#1a202c] leading-[1.05] mb-8 tracking-tight group-hover:text-[#63b34a] transition-colors">
                  {featured.title}
                </h1>
                
                <p className="text-[#718096] text-lg font-medium leading-[1.7] mb-12 line-clamp-3">
                  {featured.content.replace(/<[^>]*>?/gm, "")}
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      5 PHÚT ĐỌC
                    </span>
                  </div>
                  
                  <button className="flex items-center gap-2 text-[#63b34a] font-black uppercase tracking-widest text-sm hover:translate-x-2 transition-transform">
                    Đọc chi tiết <ChevronRight className="size-5 stroke-[3px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. News Grid (Các tin bài khác) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 mt-10">
          {others.map((article) => (
            <div key={article.id} className="flex flex-col group cursor-pointer" onClick={() => {
              console.log(`[News] Clicked article with ID: ${article.id}`);
              setSelectedBlogId(article.id);
            }}>
              <div className="relative aspect-[4/3] rounded-[35px] overflow-hidden mb-8 shadow-sm border border-gray-50">
                <img 
                  src={article.pictureUrl || `https://picsum.photos/seed/${article.id}/600/400`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={article.title}
                />
                {/* Quick actions hover */}
                <div className="absolute bottom-5 right-5 flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <button className="size-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-gray-600 hover:text-[#63b34a] shadow-xl transition-colors">
                    <Bookmark className="size-4" />
                  </button>
                  <button className="size-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-gray-600 hover:text-[#63b34a] shadow-xl transition-colors">
                    <Share2 className="size-4" />
                  </button>
                </div>
              </div>
              
              <div className="px-2">
                <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  <span className="text-[#63b34a]">Tin mới</span>
                  <span className="size-1 bg-gray-200 rounded-full" />
                  <span>{new Date(article.createAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <h3 className="text-[22px] font-black text-gray-900 leading-tight mb-4 group-hover:text-[#63b34a] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed mb-6">
                  {article.content.replace(/<[^>]*>?/gm, "")}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-300 uppercase">5 Phút đọc</span>
                  <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:bg-[#63b34a]/10 group-hover:text-[#63b34a] transition-all">
                    <ChevronRight className="size-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Pagination */}
        {pageInfo && (
          <div className="mt-16">
            <Pagination pageInfo={pageInfo} onPageChange={setPage} />
          </div>
        )}

        {/* 5. Newsletter Section */}
        <div className="mt-32 p-12 md:p-24 bg-[#f2f6f2] rounded-[60px] relative overflow-hidden flex flex-col items-center text-center border border-green-50/50">
            <div className="relative z-10 max-w-2xl">
              <div className="size-20 bg-white rounded-[24px] flex items-center justify-center text-[#63b34a] mx-auto mb-10 shadow-xl shadow-green-900/5">
                <Leaf className="size-10 fill-current" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase">
                Đăng Ký Bản Tin
              </h2>
              <p className="text-[#718096] font-medium mb-12 text-lg italic opacity-80">
                Nhận tin nông nghiệp tử tế và các chiến dịch giải cứu nông sản mới nhất.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white p-2 rounded-[24px] shadow-sm">
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="flex-1 px-6 py-4 bg-transparent outline-none font-bold text-sm text-gray-700 placeholder:text-gray-300"
                />
                <button className="px-8 py-4 bg-gray-900 text-white font-black rounded-[18px] hover:bg-black transition-all shadow-lg active:scale-95">
                  ĐĂNG KÝ NGAY
                </button>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -top-24 -left-24 size-80 bg-[#63b34a]/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 size-80 bg-[#63b34a]/10 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  );
};

export default News;
