/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Trophy, CreditCard, User, Phone, Mail, DollarSign, Hash } from 'lucide-react';

export const TopDesposit = () => {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTop = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTop();
  }, []); // ✅ thêm dependency array để chỉ gọi 1 lần

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 ml-4 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden ml-10 mt-10 mb-10">
      {/* Header Section with gradient */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute right-4 top-4 opacity-20">
          <div className="flex space-x-2">
            <div className="w-12 h-12 bg-white rounded-full opacity-30"></div>
            <div className="w-8 h-8 bg-white rounded-full opacity-20"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">
              Top 3 người nạp tiền nhiều nhất
            </h2>
            <p className="text-green-100 text-sm mt-1">
              Danh sách khách hàng nạp tiền hàng đầu
            </p>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="p-6 ">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    Hạng
                  </div>
                </th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Họ tên
                  </div>
                </th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </div>
                </th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    SĐT
                  </div>
                </th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center justify-end">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Tổng tiền đã nạp
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center justify-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Số lần nạp
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, idx) => (
                <tr key={user.userId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                        ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-500'}
                      `}>
                        {idx + 1}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{user.fullName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-600 text-sm">{user.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-600 text-sm">{user.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-bold text-green-600 text-lg">
                      {user.totalDepositAmount.toLocaleString('vi-VN')} ₫
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-medium text-sm">
                      {user.depositCount}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const TopPayment = () => {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTop = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTop();
  }, []); // ✅ thêm dependency array để chỉ gọi 1 lần

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 ml-4 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden ml-10 mt-10 mb-10">
      {/* Header Section with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute right-4 top-4 opacity-20">
          <div className="flex space-x-2">
            <div className="w-12 h-12 bg-white rounded-full opacity-30"></div>
            <div className="w-8 h-8 bg-white rounded-full opacity-20"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold">
              Top 3 người sử dụng dịch vụ nhiều nhất
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Danh sách khách hàng sử dụng dịch vụ hàng đầu
            </p>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    Hạng
                  </div>
                </th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Họ tên
                  </div>
                </th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </div>
                </th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    SĐT
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center justify-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Số dịch vụ
                  </div>
                </th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium text-sm">
                  <div className="flex items-center justify-end">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Tổng tiền đã thanh toán
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, idx) => (
                <tr key={user.userId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                        ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-500'}
                      `}>
                        {idx + 1}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{user.fullName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-600 text-sm">{user.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-600 text-sm">{user.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-medium text-sm">
                      {user.totalServices}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-bold text-blue-600 text-lg">
                      {user.totalAmount.toLocaleString('vi-VN')} ₫
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};