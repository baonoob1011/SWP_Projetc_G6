/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Blog {
  blogId: number;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

const GetBlogById = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!blogId) {
      setError('Không tìm thấy bài viết');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/blog/get-blog?blogId=${blogId}`
        );
        if (!res.ok) throw new Error('Không lấy được dữ liệu');
        const data = await res.json();
        setBlog(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blogId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <div className="text-lg text-gray-700 font-medium">Đang tải nội dung...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-lg text-red-600 font-semibold mb-2">Lỗi tải dữ liệu</div>
        <div className="text-gray-600">{error}</div>
      </div>
    </div>
  );
  
  if (!blog) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="text-lg text-gray-700 font-semibold">Không tìm thấy bài viết</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50" style={{ marginTop: 120 }}>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-5 py-3 rounded-full text-sm font-medium mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {blog.createdAt}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-10 leading-tight max-w-5xl mx-auto">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Featured Image */}
        <div className="mb-16">
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <img
              src={`data:image/*;base64,${blog.image}`}
              className="w-full h-96 md:h-[500px] lg:h-[600px] xl:h-[700px] object-cover"
              alt={blog.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        {/* Content Article */}
        <div className="bg-white rounded-2xl shadow-xl">
          <div className="p-10 md:p-16">
            <article className="prose prose-lg md:prose-xl lg:prose-2xl max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg md:text-xl lg:text-2xl font-light tracking-wide">
                {blog.content}
              </div>
            </article>
          </div>

          {/* Article Footer */}
          <div className="border-t border-gray-200 bg-blue-50 p-10 rounded-b-2xl">
            <div className="flex items-center justify-center space-x-6">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <div className="text-blue-800 font-semibold text-lg">Được đăng vào {blog.createdAt}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-10">
          <div className="flex items-center justify-center space-x-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-base text-gray-600 font-medium">Đã kiểm duyệt</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="text-base text-gray-600 font-medium">Thông tin y tế</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-base text-gray-600 font-medium">Dựa trên nghiên cứu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default GetBlogById;