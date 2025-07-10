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

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (error)
    return <div className="p-10 text-red-500 text-center">{error}</div>;
  if (!blog) return <div className="p-10 text-center">Không có dữ liệu.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ marginTop: 120 }}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="text-sm text-gray-500 p-4">{blog.createdAt}</div>
        <img
          src={`data:image/*;base64,${blog.image}`}
          className="w-full h-64 object-cover"
          alt={blog.title}
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {blog.title}
          </h2>
          <p className="text-gray-600 mb-4 whitespace-pre-line">
            {blog.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetBlogById;
