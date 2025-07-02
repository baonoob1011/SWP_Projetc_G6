import React, { useEffect, useState } from 'react';

interface Blog {
  id: number;
  title: string;
  content: string;
<<<<<<< Updated upstream
  image: string; // Base64 string hoặc URL
  category?: string;
  updatedAt?: string; // ISO string
  author?: string; // nếu có
=======
  image: string;       // Base64 string hoặc URL
  category?: string;
  updatedAt?: string;  // ISO string
  author?: string;     // nếu có
>>>>>>> Stashed changes
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/blog/get-all-blog', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Không thể lấy danh sách blog');
        const data: Blog[] = await res.json();
        setBlogs(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBlogClick = (blog: Blog) => {
<<<<<<< Updated upstream
    setSelectedBlog(blog); // Khi click vào blog, lưu blog vào state
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-400 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-200 animate-spin mx-auto"
              style={{
                animationDirection: 'reverse',
                animationDuration: '1.5s',
              }}
            ></div>
          </div>
          <p className="text-white font-semibold text-lg">
            Đang tải nội dung...
          </p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    );
=======
    setSelectedBlog(blog);  // Khi click vào blog, lưu blog vào state
  };
>>>>>>> Stashed changes

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-400 flex items-center justify-center">
      <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-200 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-white font-semibold text-lg">Đang tải nội dung...</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-400 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border-l-8 border-red-500 max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-red-800 font-bold text-lg">Có lỗi xảy ra</h3>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-500 text-white py-20 mt-20 overflow-hidden">
        {/* Header Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <svg className="w-5 h-5 mr-2 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-cyan-100 font-medium">Blog & Tin Tức</span>
          </div>
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Blog/ Tin tức xét nghiệm ADN mới nhất
          </h1>
          <p className="text-blue-100 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Những câu chuyện tuyệt vời và thông tin mới nhất đang chờ bạn khám phá
          </p>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-center space-x-4">
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
            <div className="w-8 h-1 bg-white/50 rounded-full"></div>
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32V120H1392C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120H0V64Z" fill="rgb(248, 250, 252)" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto py-16 px-6">
        {/* Nếu đã chọn một blog, hiển thị nội dung của blog đó */}
        {selectedBlog ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-100/50">
            {/* Back Button */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <button
                className="flex items-center text-white hover:text-blue-200 transition-all duration-300 group bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20"
                onClick={() => setSelectedBlog(null)}
              >
<<<<<<< Updated upstream
                <svg
                  className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
=======
                <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
>>>>>>> Stashed changes
                </svg>
                <span className="font-medium">Quay lại</span>
              </button>
            </div>

            <div className="p-10 space-y-8">
              {/* Blog Image */}
              {selectedBlog.image && (
                <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={`data:image/png;base64,${selectedBlog.image}`}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
              )}

              {/* Blog Header */}
              <div className="border-b-2 border-gradient-to-r from-blue-200 to-cyan-200 pb-8">
<<<<<<< Updated upstream
                <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
                  {selectedBlog.title}
                </h1>
=======
                <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">{selectedBlog.title}</h1>
>>>>>>> Stashed changes
                <div className="flex items-center text-blue-600 text-base space-x-6">
                  {selectedBlog.author && (
                    <span className="flex items-center bg-blue-50 rounded-full px-4 py-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
<<<<<<< Updated upstream
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold">
                        {selectedBlog.author}
                      </span>
=======
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-semibold">{selectedBlog.author}</span>
>>>>>>> Stashed changes
                    </span>
                  )}
                  {selectedBlog.updatedAt && (
                    <span className="flex items-center bg-cyan-50 rounded-full px-4 py-2">
                      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center mr-3">
<<<<<<< Updated upstream
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold">
                        {new Date(selectedBlog.updatedAt).toLocaleDateString(
                          'vi-VN'
                        )}
                      </span>
=======
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="font-semibold">{new Date(selectedBlog.updatedAt).toLocaleDateString('vi-VN')}</span>
>>>>>>> Stashed changes
                    </span>
                  )}
                </div>
              </div>

              {/* Blog Content */}
<<<<<<< Updated upstream
              <div
                className="prose prose-xl max-w-none text-gray-800 leading-relaxed whitespace-pre-line"
              >
                {selectedBlog.content}
              </div>

=======
              <div className="prose prose-xl max-w-none text-gray-800 leading-relaxed text-justify  ">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-l-4 border-blue-500">
                  {selectedBlog.content}
                </div>
              </div>
>>>>>>> Stashed changes
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Blog Grid */}
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((b) => {
                // Tạo excerpt dài ~150 ký tự
                const excerpt =
                  b.content.length > 150
                    ? b.content.slice(0, 150).trimEnd() + '...'
                    : b.content;

                return (
                  <article
                    key={b.id}
                    onClick={() => handleBlogClick(b)}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-3 hover:scale-105 border border-blue-100/50 flex flex-col h-full"
                  >
                    {/* Ảnh */}
                    {b.image && (
                      <div className="relative w-full h-56 overflow-hidden flex-shrink-0">
                        {b.image.startsWith('data:') ? (
                          <img
                            src={b.image}
                            alt={b.title}
                            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                          />
                        ) : (
                          <img
                            src={`data:image/png;base64,${b.image}`}
                            alt={b.title}
                            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Floating Read Indicator */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
<<<<<<< Updated upstream
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
=======
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
>>>>>>> Stashed changes
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Nội dung - sử dụng flex để căn chỉnh */}
                    <div className="p-8 flex flex-col flex-grow">
                      {/* Tiêu đề - cố định chiều cao */}
                      <h2 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight min-h-[3.5rem] flex items-start">
                        <span className="line-clamp-2">{b.title}</span>
                      </h2>

                      {/* Thông tin nhỏ (ngày & tác giả) - cố định vị trí */}
                      <div className="flex items-center text-blue-600 text-sm mb-4 space-x-4 flex-wrap gap-2">
                        {b.author && (
                          <span className="flex items-center bg-blue-50 rounded-full px-3 py-1">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
<<<<<<< Updated upstream
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="font-medium truncate">
                              {b.author}
                            </span>
=======
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="font-medium truncate">{b.author}</span>
>>>>>>> Stashed changes
                          </span>
                        )}
                        {b.updatedAt && (
                          <span className="flex items-center bg-cyan-50 rounded-full px-3 py-1">
                            <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
<<<<<<< Updated upstream
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <span className="font-medium whitespace-nowrap">
                              {new Date(b.updatedAt).toLocaleDateString(
                                'vi-VN',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
=======
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="font-medium whitespace-nowrap">
                              {new Date(b.updatedAt).toLocaleDateString('vi-VN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
>>>>>>> Stashed changes
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Excerpt - tự động mở rộng để lấp đầy không gian còn lại */}
                      <div className="flex-grow flex flex-col justify-between">
                        <p className="text-gray-600 leading-relaxed text-base mb-6 flex-grow">
                          <span className="line-clamp-4">{excerpt}</span>
                        </p>

                        {/* Read More Indicator - luôn ở cuối */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors duration-300">
                            <span>Đọc thêm</span>
<<<<<<< Updated upstream
                            <svg
                              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
=======
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
>>>>>>> Stashed changes
                            </svg>
                          </div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0"></div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-300/50 transition-all duration-300 pointer-events-none"></div>
                  </article>
                );
              })}
            </div>

            {/* Empty State */}
            {blogs.length === 0 && (
              <div className="text-center py-20">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
<<<<<<< Updated upstream
                    <svg
                      className="w-16 h-16 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
=======
                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
>>>>>>> Stashed changes
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
<<<<<<< Updated upstream
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Chưa có bài viết nào
                </h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                  Hãy quay lại sau để khám phá những câu chuyện tuyệt vời và
                  thông tin mới nhất
                </p>
                <div className="mt-8 flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
=======
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Chưa có bài viết nào</h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                  Hãy quay lại sau để khám phá những câu chuyện tuyệt vời và thông tin mới nhất
                </p>
                <div className="mt-8 flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
>>>>>>> Stashed changes
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;