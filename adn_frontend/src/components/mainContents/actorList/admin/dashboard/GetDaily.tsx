/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

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
        `http://localhost:8080/api/dashboard/daily-revenue?startDate=${startDate}&endDate=${endDate}`,
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

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">
        📅 Tra cứu doanh thu theo ngày
      </h2>

      {/* Bộ chọn ngày */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Từ ngày
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Đến ngày
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2 mt-1"
          />
        </div>
        <div className="self-end">
          <button
            onClick={fetchDailyRevenue}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-1"
          >
            🔍 Tải dữ liệu
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-600">Đang tải dữ liệu...</p>
      )}

      {/* Error */}
      {error && <div className="text-red-600 text-center mb-4">❌ {error}</div>}

      {/* Table hiển thị kết quả */}
      {!loading && data && (
        <>
          <table className="w-full table-auto border mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left border">Ngày</th>
                <th className="px-4 py-2 text-left border">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {data.dailyRevenues.length > 0 ? (
                data.dailyRevenues.map((item) => (
                  <tr key={item.date} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{item.date}</td>
                    <td className="px-4 py-2 border">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-500">
                    Không có dữ liệu trong khoảng thời gian đã chọn.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2 border">Tổng cộng</td>
                <td className="px-4 py-2 border">
                  {formatCurrency(data.totalRevenue)}
                </td>
              </tr>
            </tfoot>
          </table>

          <p className="text-sm text-gray-500 text-center">
            {data.description}
          </p>
        </>
      )}
    </div>
  );
};

export default GetDaily;
