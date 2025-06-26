/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AppointmentStatus.module.css';

const GetKitDeliveryStatus = () => {
  const [kitStatus, setKitStatus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  // Define order tracking steps matching API statuses
  const trackingSteps = [
    {
      id: 'pending',
      title: 'Đặt hàng thành công',
      description: 'Đơn hàng của bạn đã được đặt và đang chờ xử lý',
      icon: '📝',
      status: 'PENDING'
    },
    {
      id: 'in_progress',
      title: 'Đang xử lý',
      description: 'Đơn hàng đang được xử lý và chuẩn bị',
      icon: '⚙️',
      status: 'IN_PROGRESS'
    },
    {
      id: 'preparing',
      title: 'Đang chuẩn bị hàng',
      description: 'Bộ kit đang được chuẩn bị và đóng gói',
      icon: '📦',
      status: 'COMPLETED'
    },
    {
      id: 'shipping',
      title: 'Đang giao hàng',
      description: 'Đơn hàng đang trên đường giao đến bạn',
      icon: '🚚',
      status: 'DELIVERED'
    },
    {
      id: 'delivered',
      title: 'Giao hàng thành công',
      description: 'Đơn hàng đã được giao thành công đến bạn',
      icon: '✅',
      status: 'DONE'
    },
    {
      id: 'failed',
      title: 'Giao hàng thất bại',
      description: 'Đơn hàng giao không thành công, sẽ thử lại',
      icon: '❌',
      status: 'FAILED'
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
      case 'COMPLETED':
        return 2;
      case 'DELIVERED':
        return 3;
      case 'DONE':
        return 4;
      case 'FAILED':
        return 5;
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
      // For FAILED orders, mark previous steps as completed up to DELIVERED
      if (stepIndex < 4) return 'completed'; // PENDING, IN_PROGRESS, COMPLETED, DELIVERED
      return 'pending';
    }
    
    // For DONE status, mark all normal flow steps as completed
    if (upperStatus === 'DONE') {
      if (stepIndex <= 4) return 'completed'; // All steps completed for DONE
      return 'pending';
    }
    
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
        ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'FAILED'].includes(step.status)
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

  // Manual refresh function
  const handleRefresh = () => {
    fetchKitStatus();
  };

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

  // Get status color class
  const getStatusColorClass = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case 'PENDING':
      case 'IN_PROGRESS':
      case 'COMPLETED':
      case 'DELIVERED':
        return 'statusGray';
      case 'FAILED':
        return 'statusRed';
      case 'DONE':
        return 'statusGreen';
      default:
        return 'statusGray';
    }
  };

  if (isLoading && kitStatus.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>
            Đang tải thông tin đơn hàng...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        📦 Theo Dõi Đơn Hàng Kit DNA
        <button 
          onClick={handleRefresh}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '0.5rem 1rem',
            marginLeft: '1rem',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
          disabled={isLoading}
        >
          {isLoading ? '🔄' : '↻'} Làm mới
        </button>
      </div>

      {kitStatus.length === 0 ? (
        <div className={styles.noDataContainer}>
          <span className={styles.noDataIcon}>📦</span>
          <p className={styles.noDataText}>Không có đơn hàng nào để theo dõi.</p>
        </div>
      ) : (
        kitStatus.map((order: any, orderIndex: number) => {
          const currentStepIndex = getCurrentStepIndex(order.deliveryStatus);
          const relevantSteps = getRelevantSteps(order.deliveryStatus);
          const isExpanded = expandedOrders.has(orderIndex);
          const statusColorClass = getStatusColorClass(order.deliveryStatus);
          
          return (
            <div key={orderIndex} className={`${styles.orderCard} ${styles[statusColorClass]}`}>
              {/* Order Header */}
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <div className={styles.orderId}>
                    Đơn hàng #{orderIndex + 1}
                  </div>
                  <div className={styles.orderDate}>
                    Ngày đặt: {new Date(order.createOrderDate).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div className={styles.orderActions}>
                  <div className={`${styles.orderStatus} ${styles[statusColorClass]}`}>
                    {order.deliveryStatus}
                  </div>
                  <button 
                    className={styles.toggleButton}
                    onClick={() => toggleOrderExpansion(orderIndex)}
                  >
                    {isExpanded ? '🔼 Thu gọn' : '🔽 Xem chi tiết'}
                  </button>
                </div>
              </div>

              {/* Timeline - Conditionally rendered */}
              {isExpanded && (
                <div className={styles.timeline}>
                                  {relevantSteps.map((step, stepIndex) => {
                  const stepClass = getStepClass(stepIndex, currentStepIndex, order.deliveryStatus, step);
                  return (
                      <div key={step.id} className={`${styles.timelineStep} ${styles[stepClass]}`}>
                                              {/* Step Icon */}
                      <div className={`${styles.stepIcon} ${styles[stepClass]}`}>
                        {stepClass === 'completed' ? '✓' : stepClass === 'failed' ? '✗' : step.icon}
                      </div>

                        {/* Step Content */}
                        <div className={styles.stepContent}>
                          <div className={`${styles.stepTitle} ${styles[stepClass]}`}>
                            {step.title}
                          </div>
                          <div className={styles.stepDescription}>
                            {step.description}
                          </div>
                                                  <div className={`${styles.stepTime} ${styles[stepClass]}`}>
                          {stepClass === 'pending' ? 'Chưa thực hiện' : ''}
                        </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default GetKitDeliveryStatus;
