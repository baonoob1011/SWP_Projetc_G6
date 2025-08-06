/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const HardCopyStatusList = () => {
  const [resultStatus, setResultStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<number>>(
    new Set()
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Define certificate tracking steps matching API statuses
  const trackingSteps = [
    {
      id: 'pending',
      title: 'Chờ xử lý',
      description: 'Kết quả xét nghiệm đang được xử lý để in bản cứng',
      icon: '1',
      status: 'PENDING',
    },
    {
      id: 'printed',
      title: 'Đã in bản cứng',
      description: 'Bản cứng kết quả đã được in và chuẩn bị giao hàng',
      icon: '2',
      status: 'PRINTED',
    },
    {
      id: 'shipped',
      title: 'Đang vận chuyển',
      description: 'Bản cứng kết quả đang được vận chuyển đến bạn',
      icon: '3',
      status: 'SHIPPED',
    },
    {
      id: 'delivered',
      title: 'Đã giao thành công',
      description: 'Bản cứng kết quả đã được giao thành công đến bạn',
      icon: '4',
      status: 'DELIVERED',
    },
  ];

  // Function to get current step index based on API status
  const getCurrentStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PRINTED':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  // Function to get step class
  const getStepClass = (
    stepIndex: number,
    currentIndex: number,
    status: string
  ) => {
    // For DELIVERED status, mark all steps as completed
    if (status === 'DELIVERED') {
      if (stepIndex <= 3) return 'completed';
      return 'pending';
    }

    // For SHIPPED status, mark steps 0,1,2 as completed
    if (status === 'SHIPPED') {
      if (stepIndex <= 2) return 'completed';
      return 'pending';
    }

    // For PRINTED status, mark steps 0,1 as completed
    if (status === 'PRINTED') {
      if (stepIndex <= 1) return 'completed';
      return 'pending';
    }

    // For PENDING status, mark PENDING step as completed
    if (status === 'PENDING') {
      if (stepIndex === 0) return 'completed';
      return 'pending';
    }

    // Default logic
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

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

  // Toggle expand/collapse for specific result
  const toggleResultExpansion = (resultIndex: number) => {
    const newExpandedResults = new Set(expandedResults);
    if (newExpandedResults.has(resultIndex)) {
      newExpandedResults.delete(resultIndex);
    } else {
      newExpandedResults.add(resultIndex);
    }
    setExpandedResults(newExpandedResults);
  };

  // Get status display text
  const getStatusDisplayText = (status: string) => {
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

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 border-yellow-200';
      case 'PRINTED':
        return 'bg-blue-50 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-50 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Get status badge color
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

  // Get step styling classes
  const getStepIconClass = (stepClass: string) => {
    switch (stepClass) {
      case 'completed':
        return 'bg-green-500 text-white border-green-500 shadow-md';
      case 'active':
        return 'bg-blue-500 text-white border-blue-500 shadow-md';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  const getStepTitleClass = (stepClass: string) => {
    switch (stepClass) {
      case 'completed':
        return 'text-green-700 font-semibold';
      case 'active':
        return 'text-blue-700 font-semibold';
      case 'pending':
      default:
        return 'text-gray-600';
    }
  };

  const getStepTimeClass = (stepClass: string) => {
    switch (stepClass) {
      case 'completed':
        return 'text-green-600';
      case 'active':
        return 'text-blue-600';
      case 'pending':
      default:
        return 'text-gray-500';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(resultStatus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = resultStatus.slice(startIndex, endIndex);

  if (loading && resultStatus.length === 0) {
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
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-600 text-lg">
            Không có bản chứng nhận nào để theo dõi.
          </p>
        </div>
      ) : (
        <>
          {currentItems.map((result: any, resultIndex: number) => {
            const realIndex = startIndex + resultIndex;
            const currentStepIndex = getCurrentStepIndex(
              result.hardCopyDeliveryStatus
            );
            const isExpanded = expandedResults.has(realIndex);
            const statusColorClass = getStatusColorClass(
              result.hardCopyDeliveryStatus
            );
            const statusBadgeClass = getStatusBadgeClass(
              result.hardCopyDeliveryStatus
            );

            return (
              <div
                key={realIndex}
                className={`mb-6 rounded-xl border-2 shadow-lg overflow-hidden ${statusColorClass}`}
              >
                {/* Result Header */}
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-xl font-bold text-gray-800">
                          Kết quả #{result.result_id}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${statusBadgeClass}`}
                        >
                          {getStatusDisplayText(result.hardCopyDeliveryStatus)}
                        </span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-2">
                        <span className="text-base">📋</span>
                        <span>Mã lịch hẹn: {result.appointmentId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {result.hardCopyDeliveryStatus === 'SHIPPED' && (
                        <button
                          onClick={() => handleUpdate(result.appointmentId)}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                          Đã nhận
                        </button>
                      )}
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        onClick={() => toggleResultExpansion(realIndex)}
                      >
                        <span className="text-sm">
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </span>
                        <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 bg-white border-t border-gray-100">
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <span>Trạng thái bản chứng nhận</span>
                      </h3>

                      {/* Multi-step Progress Bar */}
                      <div className="mb-8">
                        <div className="flex items-center relative">
                          {/* Background Line */}
                          <div
                            className="absolute top-6 h-0.5 bg-gray-300 z-0"
                            style={{
                              left: '24px',
                              right: '24px',
                            }}
                          ></div>

                          {/* Progress Line */}
                          <div
                            className="absolute top-6 h-0.5 bg-green-500 z-10 transition-all duration-500"
                            style={{
                              left: '24px',
                              width: `calc((100% - 48px) * ${
                                currentStepIndex / (trackingSteps.length - 1)
                              })`,
                            }}
                          ></div>

                          {/* Step Circles Container */}
                          <div className="flex items-center justify-between w-full">
                            {/* Step Circles */}
                            {trackingSteps.map((step, stepIndex) => {
                              const stepClass = getStepClass(
                                stepIndex,
                                currentStepIndex,
                                result.hardCopyDeliveryStatus
                              );

                              return (
                                <div
                                  key={step.id}
                                  className="flex flex-col items-center relative z-20"
                                >
                                  <div
                                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${getStepIconClass(
                                      stepClass
                                    )}`}
                                  >
                                    {stepClass === 'completed'
                                      ? '✓'
                                      : step.icon}
                                  </div>
                                  <div
                                    className={`mt-3 text-xs font-medium text-center max-w-20 ${getStepTitleClass(
                                      stepClass
                                    )}`}
                                  >
                                    {step.title}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Detailed Step Information */}
                      <div className="space-y-4">
                        {trackingSteps.map((step, stepIndex) => {
                          const stepClass = getStepClass(
                            stepIndex,
                            currentStepIndex,
                            result.hardCopyDeliveryStatus
                          );

                          return (
                            <div
                              key={step.id}
                              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200"
                            >
                              {/* Step Icon */}
                              <div
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${getStepIconClass(
                                  stepClass
                                )}`}
                              >
                                {stepClass === 'completed' ? '✓' : step.icon}
                              </div>

                              {/* Step Content */}
                              <div className="flex-1">
                                <div
                                  className={`text-base font-medium mb-1 ${getStepTitleClass(
                                    stepClass
                                  )}`}
                                >
                                  {step.title}
                                </div>
                                <div className="text-gray-600 mb-2 text-sm leading-relaxed">
                                  {step.description}
                                </div>
                                <div
                                  className={`text-xs font-medium ${getStepTimeClass(
                                    stepClass
                                  )}`}
                                >
                                  {stepClass === 'pending'
                                    ? 'Chưa thực hiện'
                                    : stepClass === 'active'
                                    ? 'Đang thực hiện'
                                    : stepClass === 'completed'
                                    ? 'Đã hoàn thành'
                                    : ''}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination Controls */}
          {resultStatus.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Trang trước
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HardCopyStatusList;
