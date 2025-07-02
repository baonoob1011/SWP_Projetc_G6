import { useState } from 'react';
import { MapPin, FileText, Plus } from 'lucide-react';

type Locus = {
  locusName: string;
  description: string;
};

const CreateLocus = () => {
  const [locus, setLocus] = useState<Locus>({
    locusName: '',
    description: '',
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocus((locus) => ({
      ...locus,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/locus/create-locus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(locus),
      });
      if (!res.ok) {
        let errorMessage = 'Không thể đăng ký'; // mặc định

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await res.text();
        }

        // toast.error(errorMessage); // Use your original toast
        alert(errorMessage);
      } else {
        // toast.success('Tạo locus thành công'); // Use your original toast
        alert('Tạo locus thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-700/20 to-blue-800/20 backdrop-blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Tạo Locus Mới</h1>
                <p className="text-blue-100">Tạo và quản lý thông tin locus cho hệ thống</p>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 right-12 w-20 h-20 bg-blue-300/20 rounded-full blur-xl"></div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Locus Name */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <label htmlFor="locusName" className="text-lg font-semibold text-gray-800">
                  Locus Name
                </label>
              </div>
              <input
                type="text"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-white/50"
                id="locusName"
                name="locusName"
                onChange={handleInput}
                value={locus.locusName}
                placeholder="Nhập tên locus"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-xl">
                  <FileText className="w-5 h-5 text-sky-600" />
                </div>
                <label htmlFor="description" className="text-lg font-semibold text-gray-800">
                  Mô tả
                </label>
              </div>
              <input
                type="text"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-white/50"
                id="description"
                name="description"
                onChange={handleInput}
                value={locus.description}
                placeholder="Nhập mô tả locus"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  <span>Tạo Locus</span>
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Tự động lưu</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">Thông tin locus sẽ được lưu vào hệ thống ngay lập tức</p>
          </div>
          
          <div className="bg-sky-500/10 backdrop-blur-sm rounded-xl p-4 border border-sky-200/50">
            <div className="flex items-center gap-2 text-sky-700">
              <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              <span className="text-sm font-medium">Quản lý dễ dàng</span>
            </div>
            <p className="text-xs text-sky-600 mt-1">Có thể chỉnh sửa hoặc xóa locus sau khi tạo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLocus;