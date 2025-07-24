/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const CheckResult = () => {
  const [data, setData] = useState<any[]>([]);
  const [refund, setRefund] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (newValue: number) => {
    setTabIndex(newValue);
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-all-appointment-by-manager',
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefund = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/appointment/get-all-appointment-by-manager-to-refund',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.ok) {
        const jsonData = await res.json();
        setRefund(jsonData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (appointmentId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/payment/refund?appointmentId=${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({}),
        }
      );
      if (!res.ok) {
        toast.warning('Ko thể thực hiện');
      } else {
        toast.success('Hoàn tiền thành công');
        fetchRefund();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRefund();
  }, []);

  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#405EF3] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">Quản lý lịch hẹn & hoàn tiền</h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Manager</span>
            <span className="mx-2">›</span>
            <span>lịch hẹn & hoàn tiền</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            <div className="bg-green-500 bg-opacity-30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white text-sm font-medium">Đã hoàn thành</span>
              </div>
              <div className="text-white text-2xl font-bold">{data.length}</div>
            </div>
            
            <div className="bg-orange-500 bg-opacity-30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span className="text-white text-sm font-medium">Cần hoàn tiền</span>
              </div>
              <div className="text-white text-2xl font-bold">{refund.length}</div>
            </div>
          </div>
        
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange(0)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                tabIndex === 0
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đơn đã hoàn thành ({data.length})
            </button>
            <button
              onClick={() => handleTabChange(1)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                tabIndex === 1
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đơn cần hoàn tiền ({refund.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <CircularProgress />
          </div>
        ) : (
          <>
            {tabIndex === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          STT
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          Ngày hẹn
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          Trạng thái
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          Ghi chú
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((item: any, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                          #{String(idx + 1).padStart(4, '0')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                          {new Date(item.appointmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm border-r border-gray-200">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.appointmentStatus === 'COMPLETED' 
                              ? 'bg-green-100 text-green-800'
                              : item.appointmentStatus === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.appointmentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                          {item.note || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <NavLink 
                            to={`/checkResultById/${item.appointmentId}`}
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Xem chi tiết
                          </NavLink>
                        </td>
                      </tr>
                    ))}
                    {data.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          Không có cuộc hẹn nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tabIndex === 1 && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          STT
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          Ngày hẹn
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          Trạng thái
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                        <div className="flex items-center gap-1">
                          Ghi chú
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Hoàn tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {refund.map((item: any, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-blue-600 font-medium border-r border-gray-200">
                          #{String(idx + 1).padStart(4, '0')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">
                          {new Date(item.appointmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm border-r border-gray-200">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.appointmentStatus === 'COMPLETED' 
                              ? 'bg-green-100 text-green-800'
                              : item.appointmentStatus === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.appointmentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                          {item.note || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: 'Xác nhận hoàn tiền?',
                                text: 'Bạn có chắc chắn muốn hoàn tiền cho cuộc hẹn này?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Có, hoàn tiền!',
                                cancelButtonText: 'Hủy',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleRefund(item.appointmentId);
                                }
                              });
                            }}
                            className="inline-flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Hoàn tiền
                          </button>
                        </td>
                      </tr>
                    ))}
                    {refund.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          Không có cuộc hẹn cần hoàn tiền
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckResult;