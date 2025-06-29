/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
  Label,
} from 'recharts';

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

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

  return (
    <div>
      <h2>📊 {data?.description}</h2>
      <p>
        <strong>Tổng số dịch vụ:</strong> {data?.totalServices}
      </p>
      <p>
        <strong>Tổng số đánh giá:</strong> {data?.totalFeedbacks}
      </p>
      <p>
        <strong>Điểm trung bình chung:</strong>{' '}
        {data?.overallAverageRating.toFixed(2)}
      </p>

      <div style={{ width: '100%', height: 450, marginTop: 20 }}>
        <ResponsiveContainer>
          <BarChart
            data={data?.serviceRatings}
            margin={{ top: 30, right: 30, left: 10, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="serviceName"
              angle={-15}
              textAnchor="end"
              interval={0}
            >
              <Label value="Tên dịch vụ" position="bottom" offset={20} />
            </XAxis>
            <YAxis>
              <Label
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: 'middle' }}
              >
                Giá trị
              </Label>
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="averageRating" fill="#4CAF50" name="Điểm trung bình">
              <LabelList
                dataKey="averageRating"
                position="top"
                formatter={(v) => Number(v).toFixed(1)}
              />
            </Bar>
            <Bar dataKey="totalFeedbacks" fill="#FF9800" name="Số đánh giá">
              <LabelList dataKey="totalFeedbacks" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GetRating;
