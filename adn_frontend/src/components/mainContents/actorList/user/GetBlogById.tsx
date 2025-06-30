/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GetBlogById = () => {
  const { blogId } = useParams<string>();
  const [blog, setBlog] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/blog/get-blog?blogId=${blogId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {blog.map((blog, index) => (
        <div
          key={index}
          className="p-6 max-w-4xl mx-auto"
          style={{ marginTop: 120 }}
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div>{blog.createdAt}</div>
            <img
              src={`data:image/*;base64,${blog.image}`}
              className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt={blog.title}
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
              <div className="text-sm text-gray-400"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GetBlogById;
