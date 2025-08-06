/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

export const TopDesposit = () => {
  const [topUsers, setTopUsers] = useState<any[]>([]);

  const fetchTop = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/dashboard/top-deposit-users?limit=3`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setTopUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTop();
  }, []); // ✅ thêm dependency array để chỉ gọi 1 lần

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Top 3 người nạp tiền nhiều nhất
      </h2>
      <table className="table-auto border-collapse w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Hạng</th>
            <th className="border px-4 py-2">Họ tên</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">SĐT</th>
            <th className="border px-4 py-2">Tổng tiền đã nạp</th>
            <th className="border px-4 py-2">Số lần nạp</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user, idx) => (
            <tr key={user.userId}>
              <td className="border px-4 py-2 text-center">{idx + 1}</td>
              <td className="border px-4 py-2">{user.fullName}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phone}</td>
              <td className="border px-4 py-2 text-right">
                {user.totalDepositAmount.toLocaleString('vi-VN')} ₫
              </td>
              <td className="border px-4 py-2 text-center">
                {user.depositCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TopPayment = () => {
  const [topUsers, setTopUsers] = useState<any[]>([]);

  const fetchTop = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/dashboard/top-service-users?limit=3`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setTopUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTop();
  }, []); // ✅ thêm dependency array để chỉ gọi 1 lần

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Top 3 người sử dụng dịch vụ nhiều nhất
      </h2>
      <table className="table-auto border-collapse w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Hạng</th>
            <th className="border px-4 py-2">Họ tên</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">SĐT</th>
            <th className="border px-4 py-2">Số dịch vụ</th>
            <th className="border px-4 py-2">Tổng tiền đã thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user, idx) => (
            <tr key={user.userId}>
              <td className="border px-4 py-2 text-center">{idx + 1}</td>
              <td className="border px-4 py-2">{user.fullName}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phone}</td>
              <td className="border px-4 py-2 text-center">
                {user.totalServices}
              </td>
              <td className="border px-4 py-2 text-right">
                {user.totalAmount.toLocaleString('vi-VN')} ₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
