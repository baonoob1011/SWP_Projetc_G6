/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const GetKitDeliveryStatus = () => {
  const [kitStatus, setKitStatus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Define order tracking steps matching API statuses
  const trackingSteps = [
    {
      id: 'pending',
      title: 'Đặt hàng thành công',
      description: 'Đơn hàng của bạn đã được đặt và đang chờ giao hàng',
      icon: '1',
      status: 'PENDING',
    },
    {
      id: 'in_progress',
      title: 'Đang giao hàng',
      description: 'Đơn hàng đang được giao đến bạn',
      icon: '2',
      status: 'IN_PROGRESS',
    },
    {
      id: 'delivered',
      title: 'Đã giao thành công',
      description: 'Đơn hàng đã được giao thành công đến bạn',
      icon: '3',
      status: 'DELIVERED',
    },
    {
      id: 'done',
      title: 'Kit đã được cơ sở tiếp nhận',
      description: 'Kit đã được nhận về và xử lý xong',
      icon: '4',
      status: 'DONE',
    },
    {
      id: 'failed',
      title: 'Giao hàng thất bại',
      description: 'Đơn hàng giao không thành công, sẽ thử lại',
      icon: '!',
      status: 'FAILED',
    },
  ];

  // Function to get current step index based on API status
  const getCurrentStepIndex = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case 'PENDING':
        return 0;
      case 'IN_PROGRESS':
        return 1;
      case 'DELIVERED':
        return 2;
      case 'DONE':
        return 3;
      case 'FAILED':
        return 4;
      default:
        return 0;
    }
  };

  // Function to get step class
  const getStepClass = (
    stepIndex: number,
    currentIndex: number,
    status: string,
    step: any
  ) => {
    const upperStatus = status.toUpperCase();

    // Special case for FAILED status
    if (upperStatus === 'FAILED') {
      if (step.status === 'FAILED') {
        return 'failed';
      }
      // For FAILED orders, mark previous steps as completed up to IN_PROGRESS
      // if (stepIndex < 2) return 'completed'; // PENDING, IN_PROGRESS
      // return 'pending';
    }

    // For DONE status, mark all normal flow steps as completed
    if (upperStatus === 'DONE') {
      if (stepIndex <= 3) return 'completed'; // PENDING, IN_PROGRESS, DELIVERED, DONE
      return 'pending';
    }

    // For DELIVERED status, mark steps 0,1,2 as completed, 3 as pending
    if (upperStatus === 'DELIVERED') {
      if (stepIndex <= 2) return 'completed';
      return 'pending';
    }

    // For IN_PROGRESS status, mark both PENDING and IN_PROGRESS steps as completed
    if (upperStatus === 'IN_PROGRESS') {
      if (stepIndex <= 1) return 'completed'; // PENDING, IN_PROGRESS
      return 'pending';
    }

    // For PENDING status, mark PENDING step as completed
    if (upperStatus === 'PENDING') {
      if (stepIndex === 0) return 'completed'; // PENDING step
      return 'pending';
    }

    // For other statuses, use the default logic
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  // Function to filter relevant steps based on current status
  const getRelevantSteps = (status: string) => {
    const upperStatus = status.toUpperCase();

    // If failed, show all steps up to failed
    if (upperStatus === 'FAILED') {
      return trackingSteps.filter((step) =>
        ['PENDING', 'IN_PROGRESS', 'FAILED'].includes(step.status)
      );
    }

    // Normal flow - exclude failed step
    return trackingSteps.filter((step) => step.status !== 'FAILED');
  };

  const fetchKitStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8080/api/kit-delivery-status/get-kit-status-user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) {
        toast.error('Không thể lấy dữ liệu trạng thái kit');
        return;
      }

      const data = await res.json();
      const sortedData = [...data].sort(
        (a, b) => b.kitDeliveryStatusId - a.kitDeliveryStatusId
      );
      setKitStatus(sortedData);
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Lỗi hệ thống khi lấy trạng thái kit');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto refresh every 30 seconds to get real-time updates
  useEffect(() => {
    fetchKitStatus();

    const interval = setInterval(() => {
      fetchKitStatus();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Toggle expand/collapse for specific order
  const toggleOrderExpansion = (orderIndex: number) => {
    const newExpandedOrders = new Set(expandedOrders);
    if (newExpandedOrders.has(orderIndex)) {
      newExpandedOrders.delete(orderIndex);
    } else {
      newExpandedOrders.add(orderIndex);
    }
    setExpandedOrders(newExpandedOrders);
  };

  // Get status display text
  const getStatusDisplayText = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case 'PENDING':
        return 'Chờ giao hàng';
      case 'IN_PROGRESS':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã giao thành công';
      case 'DONE':
        return 'Kit đã được nhận về và xử lý';
      case 'FAILED':
        return 'Giao hàng thất bại';
      default:
        return status;
    }
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case 'PENDING':
      case 'IN_PROGRESS':
        return 'bg-gray-50 border-gray-200';
      case 'DELIVERED':
        return 'bg-blue-50 border-blue-200';
      case 'DONE':
        return 'bg-green-50 border-green-200';
      case 'FAILED':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DONE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get step styling classes - Updated for new design
  const getStepIconClass = (stepClass: string) => {
    switch (stepClass) {
      case 'completed':
        return 'bg-green-500 text-white border-green-500 shadow-md';
      case 'active':
        return 'bg-blue-500 text-white border-blue-500 shadow-md';
      case 'failed':
        return 'bg-red-500 text-white border-red-500 shadow-md';
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
      case 'failed':
        return 'text-red-700 font-semibold';
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
      case 'failed':
        return 'text-red-600';
      case 'pending':
      default:
        return 'text-gray-500';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(kitStatus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = kitStatus.slice(startIndex, endIndex);

  if (isLoading && kitStatus.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600 text-lg">
            Đang tải thông tin đơn hàng...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-0">
      {kitStatus.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg">
            Không có đơn hàng nào để theo dõi.
          </p>
        </div>
      ) : (
        <>
          {currentItems.map((order: any, orderIndex: number) => {
            const realIndex = startIndex + orderIndex;
            const currentStepIndex = getCurrentStepIndex(order.deliveryStatus);
            const relevantSteps = getRelevantSteps(order.deliveryStatus);
            const isExpanded = expandedOrders.has(realIndex);
            const statusColorClass = getStatusColorClass(order.deliveryStatus);
            const statusBadgeClass = getStatusBadgeClass(order.deliveryStatus);

            return (
              <div
                key={realIndex}
                className={`mb-6 rounded-xl border-2 shadow-lg overflow-hidden ${statusColorClass}`}
              >
                {/* Order Header */}
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-xl font-bold text-gray-800">
                          Đơn hàng #{realIndex + 1}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${statusBadgeClass}`}
                        >
                          {getStatusDisplayText(order.deliveryStatus)}
                        </span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-2">
                        <span className="text-base">📅</span>
                        <span>
                          Ngày đặt:{' '}
                          {new Date(order.createOrderDate).toLocaleDateString(
                            'vi-VN',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                      onClick={() => toggleOrderExpansion(realIndex)}
                    >
                      <span className="text-sm">
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </span>
                      <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
                    </button>
                  </div>
                </div>

                {/* Timeline - Conditionally rendered */}
                {/* Timeline - Conditionally rendered */}
                {isExpanded && (
                  <div className="px-6 pb-6 bg-white border-t border-gray-100">
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <span>Trạng thái giao hàng</span>
                      </h3>

                      {/* New Multi-step Progress Bar */}
                      <div className="mb-8">
                        <div className="flex items-center relative">
                          {/* Background Line */}
                          <div
                            className="absolute top-6 h-0.5 bg-gray-300 z-0"
                            style={{
                              left: '24px', // Half of circle width (48px/2)
                              right: '24px', // Half of circle width (48px/2)
                            }}
                          ></div>

                          {/* Progress Line */}
                          <div
                            className="absolute top-6 h-0.5 bg-green-500 z-10 transition-all duration-500"
                            style={{
                              left: '24px',
                              width: `calc((100% - 48px) * ${
                                currentStepIndex / (relevantSteps.length - 1)
                              })`,
                            }}
                          ></div>

                          {/* Step Circles Container */}
                          <div className="flex items-center justify-between w-full">
                            {/* Step Circles */}
                            {relevantSteps.map((step, stepIndex) => {
                              const stepClass = getStepClass(
                                stepIndex,
                                currentStepIndex,
                                order.deliveryStatus,
                                step
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
                                      : stepClass === 'failed'
                                      ? '✗'
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
                        {relevantSteps.map((step, stepIndex) => {
                          const stepClass = getStepClass(
                            stepIndex,
                            currentStepIndex,
                            order.deliveryStatus,
                            step
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
                                {stepClass === 'completed'
                                  ? '✓'
                                  : stepClass === 'failed'
                                  ? '✗'
                                  : step.icon}
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
                                    : stepClass === 'failed'
                                    ? 'Thất bại'
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
          {kitStatus.length > itemsPerPage && (
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

export default GetKitDeliveryStatus;
