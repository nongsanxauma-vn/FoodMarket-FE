import { useState, useEffect } from 'react';
import { Clock, ChevronRight, Search, Share2, Bookmark, Flame, Leaf, Coffee, Heart, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { blogService, BlogResponse } from '../../services';

const News: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogResponse | null>(null);

  const categories = [
    { name: 'Xu hướng', icon: Flame, color: 'text-orange-500' },
    { name: 'Nhà nông', icon: Leaf, color: 'text-primary' },
    { name: 'Sức khỏe', icon: Heart, color: 'text-red-500' },
    { name: 'Cẩm nang', icon: Coffee, color: 'text-brown-600' },
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

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Loader2 className="size-12 text-primary animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải tin tức nông sản...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] gap-6 px-4 text-center">
        <div className="size-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <AlertTriangle className="size-10" />
        </div>
        <div className="max-w-md">
          <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase">Lỗi tải dữ liệu</h2>
          <p className="text-gray-500 font-medium">{error}</p>
        </div>
        <button onClick={() => window.location.reload()} className="bg-primary text-white font-black px-8 py-3 rounded-xl shadow-lg shadow-primary/20">Thử lại</button>
      </div>
    );
  }

  const featuredArticle = blogs.length > 0 ? blogs[0] : null;
  const regularArticles = blogs.length > 1 ? blogs.slice(1) : [];

  if (selectedArticle) {
    return (
      <div className="flex-1 bg-white animate-in fade-in duration-500 pb-20">
        <div className="max-w-[800px] mx-auto px-4 py-12">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-12 font-bold uppercase tracking-widest text-xs group"
          >
            <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ChevronLeft className="size-4" />
            </div>
            Quay lại tin tức
          </button>

          <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-widest mb-6">
            <span className="px-3 py-1 bg-primary/10 rounded-lg">Nhà nông</span>
            <span className="size-1 bg-gray-300 rounded-full" />
            <span className="text-gray-400 flex items-center gap-1">
              <Clock className="size-3" /> {new Date(selectedArticle.createAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight font-display mb-10 tracking-tight">
            {selectedArticle.title}
          </h1>

          {selectedArticle.pictureUrl && (
            <div className="aspect-[21/9] rounded-[40px] overflow-hidden mb-12 shadow-2xl border border-gray-100">
              <img src={selectedArticle.pictureUrl} alt={selectedArticle.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
            {selectedArticle.content}
          </div>

          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Chia sẻ:</span>
              <div className="flex gap-2">
                <button className="size-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all hover:scale-110">
                  <Share2 className="size-4 flex-shrink-0" />
                </button>
                <button className="size-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all hover:scale-110">
                  <Bookmark className="size-4 flex-shrink-0" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full">
              <div className="size-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-black">
                {selectedArticle.adminName.charAt(0)}
              </div>
              <p className="text-xs font-black text-gray-600 uppercase tracking-widest">
                Biên tập: {selectedArticle.adminName}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white animate-in fade-in duration-500 pb-20">
      {/* Search & Categories Bar */}
      <div className="border-b border-gray-100 sticky top-[112px] z-30 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar w-full md:w-auto">
            {categories.map((cat, i) => (
              <button key={i} className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                <cat.icon className={`size-4 ${cat.color}`} />
                <span className="text-xs font-black uppercase tracking-widest text-gray-600">{cat.name}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 rounded-full text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-12">
        {blogs.length === 0 ? (
          <div className="py-40 text-center flex flex-col items-center gap-6">
            <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
              <Leaf className="size-12" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 uppercase">Chưa có bài viết</h3>
              <p className="text-gray-400 font-bold mt-2">Chúng tôi sẽ sớm cập nhật những tin tức mới nhất về nông sản.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <div className="group cursor-pointer mb-20" onClick={() => setSelectedArticle(featuredArticle)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative aspect-[16/10] rounded-[48px] overflow-hidden shadow-2xl border border-gray-100">
                    <img
                      src={featuredArticle.pictureUrl || 'https://picsum.photos/seed/news1/800/500'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={featuredArticle.title}
                    />
                    <div className="absolute top-8 left-8 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Tin tiêu điểm
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-widest">
                      <span>Nhà nông</span>
                      <span className="size-1 bg-gray-300 rounded-full" />
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="size-3" /> {new Date(featuredArticle.createAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight font-display group-hover:text-primary transition-colors uppercase tracking-tight">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-500 font-medium leading-relaxed text-lg line-clamp-3">
                      {featuredArticle.content.replace(/<[^>]*>?/gm, '').slice(0, 200)}...
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <span className="text-xs font-black text-gray-400 uppercase">5 phút đọc</span>
                      <button className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm hover:translate-x-2 transition-transform">
                        Đọc chi tiết <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {regularArticles.map(article => (
                <div key={article.id} className="flex flex-col group cursor-pointer" onClick={() => setSelectedArticle(article)}>
                  <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden mb-6 shadow-md border border-gray-50">
                    <img
                      src={article.pictureUrl || 'https://picsum.photos/seed/news/400/300'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={article.title}
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      <button className="size-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-lg">
                        <Bookmark className="size-4" />
                      </button>
                      <button className="size-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-lg">
                        <Share2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 px-2">
                    <div className="flex items-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <span className="text-primary">Nhà nông</span>
                      <span className="size-1 bg-gray-200 rounded-full" />
                      <span>{new Date(article.createAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">
                      {article.content.replace(/<[^>]*>?/gm, '').slice(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-bold text-gray-300 uppercase">3 phút đọc</span>
                      <span className="size-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <ChevronRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Newsletter Section */}
        <div className="mt-32 p-12 md:p-20 bg-[#f3f6f3] rounded-[64px] relative overflow-hidden flex flex-col items-center text-center">
          <div className="relative z-10 max-w-2xl">
            <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto mb-8 shadow-xl">
              <Leaf className="size-8 fill-current" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 font-display uppercase tracking-tight">
              Nhận Bản Tin Nông Nghiệp Tử Tế
            </h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed italic">
              Cập nhật những câu chuyện truyền cảm hứng, công thức nấu ăn mùa vụ và các ưu đãi "giải cứu" mới nhất mỗi tuần.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn..."
                className="flex-1 px-8 py-5 bg-white border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <button className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-900/10">
                ĐĂNG KÝ NGAY
              </button>
            </div>
            <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              * Chúng tôi cam kết không gửi thư rác. Có thể hủy đăng ký bất cứ lúc nào.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 size-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-64 bg-primary/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default News;
