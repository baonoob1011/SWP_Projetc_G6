/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts';
import { Star, BarChart3, MessageSquare, TrendingUp } from 'lucide-react';

interface ServiceRating {
  serviceId: number;
  serviceName: string;
  averageRating: number;
  totalFeedbacks: number;
  serviceType: string;
}

interface RatingData {
  serviceRatings: ServiceRating[];
  overallAverageRating: number;
  totalServices: number;
  totalFeedbacks: number;
  description: string;
}

const GetRating = () => {
  const [data, setData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(
          'http://localhost:8080/api/dashboard/service-ratings',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu');
        const result: RatingData = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 mb-6">
          <div className="flex flex-col items-center justify-center h-32 text-white">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="font-medium text-lg mb-2">Có lỗi xảy ra</p>
            <p className="text-red-100 mb-4">Lỗi: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Header cards with gradient backgrounds
  const headerCards = [
    {
      label: 'Tổng số dịch vụ',
      value: data?.totalServices,
      icon: BarChart3,
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-500',
    },
    {
      label: 'Tổng số đánh giá',
      value: data?.totalFeedbacks,
      icon: MessageSquare,
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500',
    },
    {
      label: 'Điểm trung bình chung',
      value: data?.overallAverageRating.toFixed(2),
      icon: Star,
      bgColor: 'bg-gradient-to-br from-orange-400 to-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
          <div className="flex items-center mb-2">
            <Star className="text-white mr-3" size={36} />
            <h1 className="text-white text-3xl font-bold">
              {data?.description || 'Đánh giá dịch vụ'}
            </h1>
          </div>
          <p className="text-blue-100 text-lg mb-8">
            Thống kê đánh giá và phản hồi của khách hàng.
          </p>

          <div className="flex space-x-6">
            {headerCards.map((card, idx) => (
              <div
                key={idx}
                className={`${card.bgColor} rounded-2xl p-4 min-w-[140px] shadow-lg`}
              >
                <div className="text-white mb-1">
                  <card.icon size={32} />
                </div>
                <div className="text-white text-3xl font-bold mb-1">
                  {typeof card.value === 'number'
                    ? card.value.toLocaleString()
                    : card.value || 0}
                </div>
                <div className="text-white text-sm opacity-90">
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Biểu đồ đánh giá dịch vụ
            </h2>
            <p className="text-gray-600">
              Hiển thị điểm đánh giá và số lượng phản hồi theo từng dịch vụ
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div style={{ width: '100%', height: 450 }}>
            <ResponsiveContainer>
              <ComposedChart
                data={data?.serviceRatings}
                margin={{ top: 30, right: 30, left: 10, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="serviceName"
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={{ stroke: '#d1d5db' }}
                >
                  <Label
                    value="Tên dịch vụ"
                    position="bottom"
                    offset={20}
                    style={{ fill: '#6b7280', fontSize: '14px' }}
                  />
                </XAxis>
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={{ stroke: '#d1d5db' }}
                >
                  <Label
                    angle={-90}
                    position="insideLeft"
                    style={{
                      textAnchor: 'middle',
                      fill: '#6b7280',
                      fontSize: '14px',
                    }}
                  >
                    Giá trị
                  </Label>
                </YAxis>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '14px',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ fontSize: '14px', color: '#6b7280' }}
                />

                {/* Background bars with gradient */}
                <Bar
                  dataKey="totalFeedbacks"
                  fill="url(#barGradient)"
                  name="Số đánh giá"
                  radius={[6, 6, 0, 0]}
                  opacity={0.7}
                />

                {/* Line for average rating with gradient */}
                <Line
                  type="monotone"
                  dataKey="averageRating"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  name="Điểm trung bình"
                  dot={{ fill: '#3b82f6', strokeWidth: 3, r: 6 }}
                  activeDot={{
                    r: 8,
                    stroke: '#3b82f6',
                    strokeWidth: 3,
                    fill: 'white',
                  }}
                />

                {/* Define gradients */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Enhanced Legend */}
          <div className="flex justify-center items-center gap-8 mt-6 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-400 rounded-lg border border-blue-200 opacity-70"></div>
              <span className="text-gray-700 font-medium">Số đánh giá</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Điểm trung bình</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.serviceRatings.slice(0, 4).map((service, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {service.averageRating.toFixed(1)}
            </div>
            <div
              className="text-gray-600 text-sm mb-2 truncate"
              title={service.serviceName}
            >
              {service.serviceName}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-blue-500 text-sm font-medium">
                {service.totalFeedbacks} đánh giá
              </div>
              <div className="text-gray-400 text-xs">{service.serviceType}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetRating;
