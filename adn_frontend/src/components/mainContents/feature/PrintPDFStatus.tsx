/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const HardCopyStatusList = () => {
  const [resultStatus, setResultStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResultStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/result/get-hard-copy-result',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) {
        toast.error('Không thể lấy danh sách trạng thái kết quả.');
        return;
      }

      const data = await res.json();
      const sortedData = [...data].sort((a, b) => b.result_id - a.result_id);
      setResultStatus(sortedData);
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Lỗi hệ thống khi lấy dữ liệu trạng thái.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (appointmentId: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn đã nhận được?',
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
            body: JSON.stringify({ hardCopyDeliveryStatus: 'DELIVERED' }),
          }
        );
        if (res.ok) {
          toast.success('Cập nhật thành công');
          fetchResultStatus();
        } else {
          toast.error('Cập nhật thất bại');
        }
      } catch (error) {
        console.error('Lỗi cập nhật:', error);
      }
    }
  };

  useEffect(() => {
    fetchResultStatus();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PRINTED':
        return 'Đã in';
      case 'SHIPPED':
        return 'Đang vận chuyển';
      case 'DELIVERED':
        return 'Đã giao';
      default:
        return 'Không xác định';
    }
  };

  // Get status badge color class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PRINTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get card background color
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'PRINTED':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'SHIPPED':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'DELIVERED':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600 text-lg">
            Đang tải thông tin bản chứng nhận...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-0">
      {resultStatus.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-gray-600 text-lg">
            Không có bản chứng nhận nào để theo dõi.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {resultStatus.map((item, index) => {
            const statusColorClass = getStatusColorClass(item.hardCopyDeliveryStatus);
            const statusBadgeClass = getStatusBadgeClass(item.hardCopyDeliveryStatus);
            const isDelivered = item.hardCopyDeliveryStatus === 'DELIVERED';

            return (
              <div
                key={item.result_id}
                className={`rounded-xl border-2 shadow-lg overflow-hidden transition-all duration-300 ${statusColorClass}`}
              >
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-xl font-bold text-gray-800">
                          Bản chứng nhận #{index + 1}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${statusBadgeClass}`}
                        >
                          {getStatusText(item.hardCopyDeliveryStatus)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-base">🔢</span>
                          <span className="font-medium">Mã kết quả:</span>
                          <span className="font-semibold text-gray-800">
                            {item.result_id}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-base">📋</span>
                          <span className="font-medium">Mã cuộc hẹn:</span>
                          <span className="font-semibold text-gray-800">
                            {item.appointmentId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      {!isDelivered ? (
                        <button
                          onClick={() => handleUpdate(item.appointmentId)}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                          <span>✓</span>
                          <span>Đã nhận</span>
                        </button>
                      ) : (
                        <div className="px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium border border-green-300 flex items-center gap-2">
                          <span>✓</span>
                          <span>Đã xác nhận</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Progress Indicator */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span className={`${item.hardCopyDeliveryStatus === 'PENDING' ? 'font-semibold text-yellow-700' : 'text-gray-500'}`}>
                          Chờ xử lý
                        </span>
                      </div>
                      
                      <div className="flex-1 mx-4">
                        <div className="h-0.5 bg-gray-300 relative">
                          <div 
                            className="h-0.5 bg-gradient-to-r from-yellow-500 via-blue-500 via-purple-500 to-green-500 transition-all duration-500"
                            style={{
                              width: item.hardCopyDeliveryStatus === 'PENDING' ? '25%' :
                                     item.hardCopyDeliveryStatus === 'PRINTED' ? '50%' :
                                     item.hardCopyDeliveryStatus === 'SHIPPED' ? '75%' :
                                     item.hardCopyDeliveryStatus === 'DELIVERED' ? '100%' : '0%'
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          item.hardCopyDeliveryStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span className={`${item.hardCopyDeliveryStatus === 'DELIVERED' ? 'font-semibold text-green-700' : 'text-gray-500'}`}>
                          Đã giao
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HardCopyStatusList;