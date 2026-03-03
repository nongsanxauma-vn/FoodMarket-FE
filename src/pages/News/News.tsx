import { useState, useEffect } from 'react';
import { Clock, Search, Share2, Bookmark, Flame, Leaf, Coffee, Heart, Loader2, AlertTriangle, ChevronLeft, ArrowRight } from 'lucide-react';
import { blogService, BlogResponse } from '../../services';

const News: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Tất cả', icon: null, color: 'text-gray-900' },
    { name: 'Xu hướng', icon: Flame, color: 'text-orange-500' },
    { name: 'Nhà nông', icon: Leaf, color: 'text-primary' },
    { name: 'Sức khỏe', icon: Heart, color: 'text-red-500' },
    { name: 'Cẩm nang', icon: Coffee, color: 'text-amber-600' },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await blogService.getPublishedBlogs();
        if (response.result) {
          setBlogs(response.result);
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError('Không thể tải các bài viết lúc này.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    (activeCategory === 'Tất cả' || true) && // Placeholder if category filtering is implemented later
    (blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[600px] bg-[#FAFAFA]">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] gap-6 px-4 bg-[#FAFAFA]">
        <div className="size-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 shadow-inner">
          <AlertTriangle className="size-10" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Trục trặc một chút!</h2>
          <p className="text-gray-500 font-medium leading-relaxed">{error}</p>
        </div>
        <button onClick={() => window.location.reload()} className="mt-4 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black hover:scale-105 transition-all shadow-xl shadow-gray-900/20 active:scale-95">
          Tải lại trang
        </button>
      </div>
    );
  }

  const featuredArticle = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const regularArticles = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  if (selectedArticle) {
    return (
      <div className="flex-1 bg-white min-h-screen">
        {/* Dynamic Reader Header */}
        <div className="relative h-[55vh] min-h-[480px] w-full group overflow-hidden bg-gray-900">
          <img
            src={selectedArticle.pictureUrl || 'https://picsum.photos/seed/news_bg/1920/1080'}
            alt={selectedArticle.title}
            className="w-full h-full object-cover opacity-60 transition-transform duration-[20s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="absolute top-8 left-8 md:left-20 z-20">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white font-bold text-sm transition-all border border-white/10 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronLeft className="size-4" /> Trở lại
            </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full px-6 md:px-20 py-12 z-20">
            <div className="max-w-[1000px]">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-primary/30">
                  Bài Viết Nổi Bật
                </span>
                <span className="flex items-center gap-2 text-white/90 text-sm font-medium backdrop-blur-sm px-4 py-1.5 rounded-full bg-black/40 border border-white/10">
                  <Clock className="size-4" /> {new Date(selectedArticle.createAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-8 drop-shadow-2xl">
                {selectedArticle.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-xl text-white shadow-xl">
                  {selectedArticle.adminName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">{selectedArticle.adminName}</p>
                  <p className="text-xs text-white/70 font-medium">Biên tập viên</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="max-w-[800px] mx-auto px-6 py-16 md:py-24">
          <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 font-medium leading-[1.8] whitespace-pre-wrap select-text">
            {selectedArticle.content}
          </div>

          {/* Interaction Bar */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-gray-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl text-gray-500 font-bold text-sm transition-all group border border-gray-100 hover:border-rose-100">
                <Heart className="size-5 group-hover:fill-current" /> Yêu thích bài viết
              </button>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none size-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all border border-gray-100">
                <Share2 className="size-5" />
              </button>
              <button className="flex-1 sm:flex-none size-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all border border-gray-100">
                <Bookmark className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-screen pb-32">
      {/* Top Header Filter Section */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-[112px] z-30 shadow-sm flex-col">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
            {categories.map((cat, i) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-[1.25rem] text-sm font-bold transition-all duration-300 whitespace-nowrap ${isActive
                      ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 transform scale-105'
                      : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100'
                    }`}
                >
                  {cat.icon && <cat.icon className={`size-4 ${isActive ? 'text-white' : cat.color}`} />}
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-[400px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, xu hướng..."
              className="w-full pl-13 pr-6 py-4 bg-white border border-gray-200 rounded-[1.25rem] text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:font-medium placeholder:text-gray-400 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12">
        {filteredBlogs.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-150" />
              <div className="size-32 bg-white rounded-full flex items-center justify-center text-gray-200 relative z-10 shadow-xl border border-gray-50">
                <Search className="size-12" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Không tìm thấy nội dung</h3>
            <p className="text-gray-500 font-medium max-w-md leading-relaxed text-lg">Hệ thống chưa có bài viết nào phù hợp với bộ lọc. Thử tìm kiếm với một từ khóa khác nhé.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-16">

            {/* Featured Hero Article */}
            {featuredArticle && (
              <div
                className="group relative bg-white rounded-[3rem] p-4 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-16"
                onClick={() => setSelectedArticle(featuredArticle)}
              >
                <div className="w-full lg:w-3/5 h-[350px] lg:h-[500px] relative rounded-[2.5rem] overflow-hidden">
                  <img
                    src={featuredArticle.pictureUrl || 'https://picsum.photos/seed/featured/1000/600'}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={featuredArticle.title}
                  />
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-widest text-primary shadow-2xl border border-white/50">🔥 Tiêu điểm</span>
                  </div>
                </div>

                <div className="w-full lg:w-2/5 flex flex-col justify-center py-6 pr-6 lg:pr-12">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-lg">
                      <Clock className="size-4" /> Đọc 5 phút
                    </span>
                    <span className="text-xs font-bold text-gray-500">{new Date(featuredArticle.createAt).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <h2 className="text-3xl lg:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6 group-hover:text-primary transition-colors line-clamp-3">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-gray-500 font-medium leading-relaxed text-lg mb-10 line-clamp-3">
                    {featuredArticle.content.replace(/<[^>]*>?/gm, '')}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xl shadow-inner">
                        {featuredArticle.adminName.charAt(0)}
                      </div>
                      <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{featuredArticle.adminName}</span>
                    </div>
                    <div className="size-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                      <ArrowRight className="size-6" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid Layout for remaining articles */}
            {regularArticles.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-10">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">Tin Mới Nhất</h3>
                  <div className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400">
                    <span className="text-primary">{regularArticles.length}</span> bài viết
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularArticles.map(article => (
                    <div
                      key={article.id}
                      className="group bg-white rounded-[2.5rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] border border-gray-100 transition-all duration-500 cursor-pointer flex flex-col transform hover:-translate-y-2"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6">
                        <img
                          src={article.pictureUrl || `https://picsum.photos/seed/${article.id}/600/400`}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                          alt={article.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 right-4 flex gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button className="size-12 bg-white/20 hover:bg-primary backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all border border-white/20">
                            <Bookmark className="size-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 px-4 pb-4">
                        <div className="flex items-center gap-3 mb-5 mt-2">
                          <span className="px-3.5 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100">
                            Chuyên mục
                          </span>
                          <span className="text-xs font-bold text-gray-400">
                            {new Date(article.createAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 leading-[1.3] tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-base text-gray-500 font-medium leading-[1.7] line-clamp-3 mb-8 flex-1">
                          {article.content.replace(/<[^>]*>?/gm, '')}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <div className="size-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[10px] text-gray-600">
                              {article.adminName.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-gray-600">{article.adminName}</span>
                          </div>
                          <span className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="size-5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Big Beautiful CTA Newsletter Section */}
            <div className="mt-20 bg-gray-900 rounded-[3.5rem] p-10 md:p-24 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-16 border border-gray-800">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -top-64 -left-64 size-[800px] bg-primary rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute -bottom-64 -right-64 size-[800px] bg-blue-500 rounded-full blur-[120px] mix-blend-screen" />
              </div>

              <div className="relative z-10 flex-1 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white font-black text-xs uppercase tracking-widest mb-8 border border-white/20">
                  <Leaf className="size-4" /> Chuyên sâu hàng tuần
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
                  Trở thành chuyên gia nông nghiệp <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">chỉ mất 5 phút</span> mỗi ngày.
                </h2>
                <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-4">
                  Tham gia cùng 10,000+ nhà nông và độc giả để nhận cập nhật độc quyền về giá nông sản, giống mới và kỹ năng trồng trọt.
                </p>
              </div>

              <div className="relative z-10 w-full lg:w-[450px]">
                <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <div className="flex flex-col gap-4">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Đăng Ký</label>
                    <input
                      type="email"
                      placeholder="vidu@gmail.com"
                      className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:bg-white/10 focus:border-primary/50 transition-all placeholder:text-gray-600 placeholder:font-medium text-base font-bold shadow-inner"
                    />
                    <button className="w-full px-6 py-5 mt-2 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all duration-300 shadow-[0_0_40px_rgb(34,197,94,0.3)] transform active:scale-95 flex justify-center items-center gap-2">
                      Đăng Ký Miễn Phí <ArrowRight className="size-5" />
                    </button>
                    <p className="text-center text-xs text-gray-500 font-medium mt-4">
                      Cam kết không quảng cáo rác. Hủy bất kì lúc nào.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default News;
