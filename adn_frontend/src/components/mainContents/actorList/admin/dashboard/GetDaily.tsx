/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Calendar,
  Search,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface DailyRevenueResponse {
  dailyRevenues: DailyRevenue[];
  totalRevenue: number;
  description: string;
}

const GetDaily = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState<DailyRevenueResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    });

  const fetchDailyRevenue = async () => {
    if (!startDate || !endDate) {
      setError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không có token xác thực');

      const res = await fetch(
        `http://localhost:8080/api/dashboard/weekly-daily-revenue?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) throw new Error('Token hết hạn.');
        else if (res.status === 403)
          throw new Error('Không có quyền truy cập.');
        else if (res.status === 404) throw new Error('API không tồn tại.');
        else throw new Error(`Lỗi server: ${res.status}`);
      }

      const responseData = await res.json();
      setData(responseData);
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 mb-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="text-white ml-4 text-lg font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 ml-10">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 mb-6">
          <div className="flex flex-col items-center justify-center h-32 text-white">
            <AlertCircle size={48} className="mb-2" />
            <p className="font-medium text-lg mb-2">Có lỗi xảy ra</p>
            <p className="text-red-100 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-6 py-2 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10 ml-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 mb-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-full opacity-20">
          <div className="flex items-center justify-end h-full pr-8">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-white rounded-full opacity-30"></div>
              <div className="w-16 h-16 bg-white rounded-full opacity-20"></div>
              <div className="w-12 h-12 bg-white rounded-full opacity-40"></div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <h1 className="text-white text-3xl font-bold">
              Tra cứu doanh thu theo ngày
            </h1>
          </div>
          <p className="text-blue-100 text-lg mb-8">
            Xem chi tiết doanh thu trong khoảng thời gian bạn chọn.
          </p>

          {/* Date selector cards */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
              <label className="block text-white text-sm font-medium mb-2 mr-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white rounded-xl px-4 py-2 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
              <label className="block text-white text-sm font-medium mb-2 mr-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white rounded-xl px-4 py-2 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div
              className="bg-green-400 rounded-2xl p-4 min-w-[140px] cursor-pointer hover:bg-green-500 transition-colors"
              onClick={fetchDailyRevenue}
            >
              <div className="text-white mb-1">
                <Search size={32} />
              </div>
              <div className="text-white text-lg font-bold">Tải dữ liệu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && data && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {data && (
        <>
          {/* Summary Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.totalRevenue)}
                  </h3>
                  <p className="text-gray-600">Tổng doanh thu</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-500 text-sm font-bold">
                  {data.dailyRevenues.length} ngày
                </div>
                <div className="text-gray-400 text-xs">Có dữ liệu</div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Chi tiết doanh thu theo ngày
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Ngày
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Doanh thu
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.dailyRevenues.length > 0 ? (
                    data.dailyRevenues.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          {item.date}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-600 font-semibold">
                            {formatCurrency(item.revenue)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Calendar className="w-6 h-6 text-gray-400" />
                          </div>
                          <p>
                            Không có dữ liệu trong khoảng thời gian đã chọn.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-blue-50">
                  <tr>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      Tổng cộng
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-600 text-lg font-bold">
                        {formatCurrency(data.totalRevenue)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Description */}
          {data.description && (
            <div className="mt-6 bg-blue-50 rounded-2xl p-4">
              <p className="text-blue-700 text-center font-medium">
                {data.description}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GetDaily;
