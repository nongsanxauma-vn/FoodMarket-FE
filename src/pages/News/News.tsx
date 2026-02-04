
import React from 'react';
import { Clock, ChevronRight, Search, Share2, Bookmark, Flame, Leaf, Coffee, Heart } from 'lucide-react';

const News: React.FC = () => {
  const categories = [
    { name: 'Xu hướng', icon: Flame, color: 'text-orange-500' },
    { name: 'Nhà nông', icon: Leaf, color: 'text-primary' },
    { name: 'Sức khỏe', icon: Heart, color: 'text-red-500' },
    { name: 'Cẩm nang', icon: Coffee, color: 'text-brown-600' },
  ];

  const articles = [
    {
      id: 1,
      category: 'Nhà nông',
      title: 'Hành trình giải cứu 10 tấn cam sành Vĩnh Long của cộng đồng Xấu Mã',
      excerpt: 'Trong vòng chưa đầy 48 giờ, hàng ngàn đơn hàng đã được gửi đi, giúp bà con nông dân vượt qua giai đoạn khó khăn...',
      date: '24 Tháng 10, 2023',
      readTime: '5 phút đọc',
      image: 'https://picsum.photos/seed/news1/800/500',
      isFeatured: true
    },
    {
      id: 2,
      category: 'Sức khỏe',
      title: 'Tại sao nông sản "xấu mã" lại chứa nhiều dinh dưỡng hơn bạn tưởng?',
      excerpt: 'Các nghiên cứu mới nhất chỉ ra rằng trái cây có sẹo tự nhiên thường tích tụ nhiều chất chống oxy hóa hơn...',
      date: '22 Tháng 10, 2023',
      readTime: '4 phút đọc',
      image: 'https://picsum.photos/seed/news2/400/300'
    },
    {
      id: 3,
      category: 'Cẩm nang',
      title: '5 công thức món ngon từ cà rốt hữu cơ dập nhẹ',
      excerpt: 'Đừng vội bỏ đi những củ cà rốt bị gãy hoặc trầy xước vỏ. Hãy biến chúng thành món súp kem chuẩn nhà hàng...',
      date: '20 Tháng 10, 2023',
      readTime: '6 phút đọc',
      image: 'https://picsum.photos/seed/news3/400/300'
    },
    {
      id: 4,
      category: 'Xu hướng',
      title: 'Lối sống Zero-Waste: Tận dụng vỏ rau củ làm phân bón tại gia',
      excerpt: 'Hướng dẫn chi tiết cách ủ phân xanh từ rác thải bếp núc đơn giản, không mùi cho cư dân chung cư...',
      date: '18 Tháng 10, 2023',
      readTime: '8 phút đọc',
      image: 'https://picsum.photos/seed/news4/400/300'
    }
  ];

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
        {/* Featured Article */}
        {articles.filter(a => a.isFeatured).map(featured => (
          <div key={featured.id} className="group cursor-pointer mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[16/10] rounded-[48px] overflow-hidden shadow-2xl border border-gray-100">
                <img 
                  src={featured.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={featured.title}
                />
                <div className="absolute top-8 left-8 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Tin tiêu điểm
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-widest">
                  <span>{featured.category}</span>
                  <span className="size-1 bg-gray-300 rounded-full" />
                  <span className="text-gray-400 flex items-center gap-1"><Clock className="size-3" /> {featured.date}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight font-display group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed text-lg">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className="text-xs font-black text-gray-400 uppercase">{featured.readTime}</span>
                  <button className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm hover:translate-x-2 transition-transform">
                    Đọc chi tiết <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {articles.filter(a => !a.isFeatured).map(article => (
            <div key={article.id} className="flex flex-col group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden mb-6 shadow-md border border-gray-50">
                <img 
                  src={article.image} 
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
                  <span className="text-primary">{article.category}</span>
                  <span className="size-1 bg-gray-200 rounded-full" />
                  <span>{article.date}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between mt-2">
                   <span className="text-[10px] font-bold text-gray-300 uppercase">{article.readTime}</span>
                   <span className="size-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                     <ChevronRight className="size-4" />
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

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
