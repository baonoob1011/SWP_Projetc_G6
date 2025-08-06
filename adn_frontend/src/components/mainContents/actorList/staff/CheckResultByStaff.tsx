/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

const CheckResultByStaff = () => {
  const [data, setData] = useState<any[]>([]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PRINTED':
        return 'Đã in xong';
      case 'SHIPPED':
        return 'Đã gửi vận chuyển';
      case 'DELIVERED':
        return 'Đã giao cho khách';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return 'Chờ xác nhận';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PRINTED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CONFIRMED':
        return 'bg-indigo-100 text-indigo-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-all-appointment-by-staff-to-send-hard-copy',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      }
    } catch (error) {
      console.error('Lỗi fetch dữ liệu:', error);
    }
  };

  const handleUpdate = async (appointmentId: string, newStatus: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận thay đổi?',
      text: 'Bạn có chắc chắn muốn đổi trạng thái này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:8080/api/result/update-hard-copy-result?appointmentId=${appointmentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ hardCopyDeliveryStatus: newStatus }),
          }
        );
        if (res.ok) {
          toast.success('Cập nhật thành công');
          fetchData();
        } else {
          toast.error('Cập nhật thất bại');
        }
      } catch (error) {
        console.error('Lỗi cập nhật:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#405EF3] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">
              Quản lý đơn in bản cứng
            </h2>
          </div>
        </div>
        {/* Tab Navigation */}

        {/* Tab Content */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    STT
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Ngày hẹn
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Trạng thái lịch hẹn
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Ghi chú
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  <div className="flex items-center gap-1">
                    Trạng thái bản cứng
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item: any, idx: number) => (
                <tr
                  key={item.appointmentId || idx}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                    #{String(idx + 1).padStart(4, '0')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                    {item.appointmentDate
                      ? new Date(item.appointmentDate).toLocaleDateString(
                          'vi-VN'
                        )
                      : 'Không rõ'}
                  </td>
                  <td className="px-4 py-3 text-sm border-r border-gray-200">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                        item.appointmentStatus
                      )}`}
                    >
                      {getStatusText(item.appointmentStatus)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                    <div
                      className="max-w-xs truncate"
                      title={item.note || 'Không có'}
                    >
                      {item.note || 'Không có'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm border-r border-gray-200">
                    <select
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={item.hardCopyDeliveryStatus}
                      onChange={(e) =>
                        handleUpdate(item.appointmentId, e.target.value)
                      }
                    >
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="PRINTED">Đã in xong</option>
                      <option value="SHIPPED">Đã gửi vận chuyển</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <NavLink
                      to={`/result/${item.appointmentId}`}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Chi tiết
                    </NavLink>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p>Không có yêu cầu nào cần xử lý</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CheckResultByStaff;
