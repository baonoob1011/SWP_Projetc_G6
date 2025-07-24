/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  MapPin,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

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
      iconComponent: Clock,
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'in_progress',
      title: 'Đang giao hàng',
      description: 'Đơn hàng đang được giao đến bạn',
      icon: '2',
      status: 'IN_PROGRESS',
      iconComponent: Truck,
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'delivered',
      title: 'Đã giao thành công',
      description: 'Đơn hàng đã được giao thành công đến bạn',
      icon: '3',
      status: 'DELIVERED',
      iconComponent: CheckCircle,
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 'done',
      title: 'Kit đã được cơ sở tiếp nhận',
      description: 'Kit đã được nhận về và xử lý xong',
      icon: '4',
      status: 'DONE',
      iconComponent: Package,
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'failed',
      title: 'Giao hàng thất bại',
      description: 'Đơn hàng giao không thành công, sẽ thử lại',
      icon: '!',
      status: 'FAILED',
      iconComponent: XCircle,
      gradient: 'from-red-400 to-pink-500'
    }
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
  const getStepClass = (stepIndex: number, currentIndex: number, status: string, step: any) => {
    const upperStatus = status.toUpperCase();
    
    // Special case for FAILED status
    if (upperStatus === 'FAILED') {
      if (step.status === 'FAILED') {
        return 'failed';
      }
      // For FAILED orders, mark previous steps as completed up to IN_PROGRESS
      if (stepIndex < 2) return 'completed'; // PENDING, IN_PROGRESS
      return 'pending';
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
      return trackingSteps.filter(step => 
        ['PENDING', 'IN_PROGRESS', 'FAILED'].includes(step.status)
      );
    }
    
    // Normal flow - exclude failed step
    return trackingSteps.filter(step => step.status !== 'FAILED');
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
      setKitStatus(data);
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
        return 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
      case 'DELIVERED':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
      case 'DONE':
        return 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200';
      case 'FAILED':
        return 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200';
      default:
        return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200';
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    const upperStatus = status.toUpperCase();
    const step = trackingSteps.find(s => s.status === upperStatus);
    const gradient = step?.gradient || 'from-gray-400 to-gray-500';
    
    switch (upperStatus) {
      case 'PENDING':
        return `bg-gradient-to-r ${gradient} text-white border-0 shadow-lg`;
      case 'IN_PROGRESS':
        return `bg-gradient-to-r ${gradient} text-white border-0 shadow-lg`;
      case 'DELIVERED':
        return `bg-gradient-to-r ${gradient} text-white border-0 shadow-lg`;
      case 'DONE':
        return `bg-gradient-to-r ${gradient} text-white border-0 shadow-lg`;
      case 'FAILED':
        return `bg-gradient-to-r ${gradient} text-white border-0 shadow-lg`;
      default:
        return `bg-gradient-to-r ${gradient} text-white border-0 shadow-lg`;
    }
  };

  // Get step styling classes - Updated for new design
  const getStepIconClass = (stepClass: string, step: any) => {
    switch (stepClass) {
      case 'completed':
        return `bg-green-500 text-white border-green-500 shadow-md`;
      case 'active':
        return `bg-blue-500 text-white border-blue-500 shadow-md`;
      case 'failed':
        return `bg-red-500 text-white border-red-500 shadow-md`;
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  const getStepTitleClass = (stepClass: string, step: any) => {
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

  const getStepTimeClass = (stepClass: string, step: any) => {
    const baseColor = step.gradient?.includes('green') ? 'text-green-600' : 
                     step.gradient?.includes('blue') ? 'text-blue-600' :
                     step.gradient?.includes('yellow') ? 'text-yellow-600' :
                     step.gradient?.includes('red') ? 'text-red-600' : 'text-gray-600';
    
    switch (stepClass) {
      case 'completed':
        return 'text-green-600 font-medium';
      case 'active':
        return `${baseColor} font-medium`;
      case 'failed':
        return 'text-red-600 font-medium';
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
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin mb-4"></div>
        <div className="text-gray-600 text-lg">
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {kitStatus.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">Không có đơn hàng nào để theo dõi.</p>
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
            const currentStep = trackingSteps.find(s => s.status === order.deliveryStatus.toUpperCase());
            
            return (
              <div key={realIndex} className={`rounded-2xl border-2 shadow-lg overflow-hidden ${statusColorClass}`}>
                {/* Order Header */}
                <div className="p-6 bg-white/70 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-gradient-to-r ${currentStep?.gradient || 'from-gray-400 to-gray-500'} shadow-lg`}>
                            {currentStep?.iconComponent && (
                              <currentStep.iconComponent className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              Đơn hàng #{realIndex + 1}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {new Date(order.createOrderDate).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusBadgeClass}`}>
                          {getStatusDisplayText(order.deliveryStatus)}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                      onClick={() => toggleOrderExpansion(realIndex)}
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Thu gọn</span>
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Xem chi tiết</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Timeline - Conditionally rendered */}
                {isExpanded && (
                  <div className="px-6 pb-6 bg-white/50 backdrop-blur-sm border-t border-white/30">
                    <div className="mt-6">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">
                          Trạng thái giao hàng
                        </h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                      </div>
                      
                      {/* Enhanced Multi-step Progress Bar */}
                      <div className="mb-10">
                        <div className="flex items-center relative">
                          {/* Background Line */}
                          <div 
                            className="absolute top-6 h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full z-0"
                            style={{
                              left: '24px',
                              right: '24px'
                            }}
                          ></div>
                          
                          {/* Progress Line */}
                          <div 
                            className="absolute top-6 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full z-10 transition-all duration-1000 ease-out shadow-sm"
                            style={{
                              left: '24px',
                              width: `calc((100% - 48px) * ${Math.max(0, currentStepIndex / Math.max(1, relevantSteps.length - 1))})`
                            }}
                          ></div>
                          
                          {/* Step Circles Container */}
                          <div className="flex items-center justify-between w-full">
                            {relevantSteps.map((step, stepIndex) => {
                              const stepClass = getStepClass(stepIndex, currentStepIndex, order.deliveryStatus, step);
                              const IconComponent = step.iconComponent;
                              
                              return (
                                <div key={step.id} className="flex flex-col items-center relative z-20 group">
                                  <div 
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 transform hover:scale-110 ${getStepIconClass(stepClass, step)}`}
                                  >
                                    {stepClass === 'completed' ? (
                                      <CheckCircle className="w-6 h-6" />
                                    ) : stepClass === 'failed' ? (
                                      <XCircle className="w-6 h-6" />
                                    ) : (
                                      <IconComponent className="w-5 h-5" />
                                    )}
                                  </div>
                                  <div className={`mt-3 text-xs font-bold text-center max-w-20 leading-tight transition-all duration-300 ${getStepTitleClass(stepClass, step)}`}>
                                    {step.title}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Detailed Step Information */}
                      <div className="space-y-4">
                        {relevantSteps.map((step, stepIndex) => {
                          const stepClass = getStepClass(stepIndex, currentStepIndex, order.deliveryStatus, step);
                          const IconComponent = step.iconComponent;
                          
                          return (
                            <div key={step.id} className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                              stepClass === 'active' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md' :
                              stepClass === 'completed' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
                              stepClass === 'failed' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' :
                              'bg-white/70 border-gray-200 backdrop-blur-sm'
                            }`}>
                              {/* Step Icon */}
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0 transition-all duration-300 ${getStepIconClass(stepClass, step)}`}>
                                {stepClass === 'completed' ? (
                                  <CheckCircle className="w-6 h-6" />
                                ) : stepClass === 'failed' ? (
                                  <XCircle className="w-6 h-6" />
                                ) : (
                                  <IconComponent className="w-5 h-5" />
                                )}
                              </div>
                              
                              {/* Step Content */}
                              <div className="flex-1">
                                <div className={`text-lg font-bold mb-2 ${getStepTitleClass(stepClass, step)}`}>
                                  {step.title}
                                </div>
                                <div className="text-gray-600 mb-3 text-sm leading-relaxed">
                                  {step.description}
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                                  stepClass === 'pending' ? 'bg-gray-100 text-gray-600' :
                                  stepClass === 'active' ? `bg-gradient-to-r ${step.gradient} text-white shadow-sm` :
                                  stepClass === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm' :
                                  stepClass === 'failed' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm' : ''
                                }`}>
                                  {stepClass === 'pending' ? (
                                    <>
                                      <Clock className="w-3 h-3" />
                                      <span>Chưa thực hiện</span>
                                    </>
                                  ) : stepClass === 'active' ? (
                                    <>
                                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                      <span>Đang thực hiện</span>
                                    </>
                                  ) : stepClass === 'completed' ? (
                                    <>
                                      <CheckCircle className="w-3 h-3" />
                                      <span>Đã hoàn thành</span>
                                    </>
                                  ) : stepClass === 'failed' ? (
                                    <>
                                      <AlertCircle className="w-3 h-3" />
                                      <span>Thất bại</span>
                                    </>
                                  ) : null}
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
          
          {/* Enhanced Pagination Controls */}
          {kitStatus.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-10 gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white/70 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-xl backdrop-blur-sm border border-gray-200'
                }`}
              >
                ← Trang trước
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl'
                        : 'bg-white/70 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 backdrop-blur-sm border border-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white/70 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-xl backdrop-blur-sm border border-gray-200'
                }`}
              >
                Trang sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GetKitDeliveryStatus;