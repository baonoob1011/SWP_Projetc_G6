package swp.project.adn_backend.service.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.response.DashboardResponse;
import swp.project.adn_backend.dto.response.DailyRevenueResponse;
import swp.project.adn_backend.dto.response.ServiceRatingStatsResponse;
import swp.project.adn_backend.dto.response.TotalUsersCompletedResponse;
import swp.project.adn_backend.dto.response.TotalCancelledAppointmentsResponse;
import swp.project.adn_backend.dto.response.AppointmentStatusPercentageResponse;
import swp.project.adn_backend.repository.UserRepository;
import swp.project.adn_backend.repository.InvoiceRepository;
import swp.project.adn_backend.repository.FeedbackRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;
import swp.project.adn_backend.repository.AppointmentRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;
    private final FeedbackRepository feedbackRepository;
    private final ServiceTestRepository serviceTestRepository;
    private final AppointmentRepository appointmentRepository;
    
    @Autowired
    public DashboardService(UserRepository userRepository, InvoiceRepository invoiceRepository,
                          FeedbackRepository feedbackRepository, ServiceTestRepository serviceTestRepository,
                          AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
        this.feedbackRepository = feedbackRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.appointmentRepository = appointmentRepository;
    }
    
    
    public DashboardResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countActiveUsers();
        long inactiveUsers = userRepository.countInactiveUsers();
        long totalPatients = userRepository.countUsersByPatientRole();
        long totalStaff = userRepository.countUsersByStaffRole();
        long totalManagers = userRepository.countUsersByManagerRole();
        long totalAdmins = userRepository.countUsersByAdminRole();
        long totalUsersRegisteredService = appointmentRepository.countDistinctUsersRegisteredService();
        
        DashboardResponse response = new DashboardResponse(
            totalUsers,
            activeUsers,
            inactiveUsers,
            totalPatients,
            totalStaff,
            totalManagers,
            totalAdmins
        );
        response.setTotalUsersRegisteredService(totalUsersRegisteredService);
        return response;
    }

    /**
     * Lấy thống kê đánh giá theo từng service
     */
    public ServiceRatingStatsResponse getServiceRatingStats() {
        List<Object[]> rawStats = feedbackRepository.getServiceRatingStats();
        List<ServiceRatingStatsResponse.ServiceRatingInfo> serviceRatings = new ArrayList<>();
        
        double totalRating = 0.0;
        long totalFeedbacks = 0;
        
        for (Object[] row : rawStats) {
            Long serviceId = (Long) row[0];
            String serviceName = (String) row[1];
            Double avgRating = (Double) row[2];
            Long feedbackCount = (Long) row[3];
            String serviceType = row[4] != null ? row[4].toString() : "UNKNOWN";
            
            // Xử lý trường hợp service không có feedback
            if (avgRating == null) {
                avgRating = 0.0;
            }
            if (feedbackCount == null) {
                feedbackCount = 0L;
            }
            
            ServiceRatingStatsResponse.ServiceRatingInfo serviceInfo = 
                new ServiceRatingStatsResponse.ServiceRatingInfo(
                    serviceId, serviceName, avgRating, feedbackCount, serviceType
                );
            serviceRatings.add(serviceInfo);
            
            totalRating += avgRating * feedbackCount;
            totalFeedbacks += feedbackCount;
        }
        
        // Tính đánh giá trung bình tổng thể
        double overallAverageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0.0;
        long totalServices = serviceTestRepository.count();
        
        return new ServiceRatingStatsResponse(
            serviceRatings,
            overallAverageRating,
            totalServices,
            totalFeedbacks,
            "Thống kê đánh giá theo từng dịch vụ"
        );
    }

    public Long getTotalRevenue(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
            Long totalRevenue = invoiceRepository.sumSuccessfulAmountBetween(startDateTime, endDateTime);
            return totalRevenue != null ? totalRevenue : 0L;
        }
        Long totalRevenue = invoiceRepository.sumSuccessfulAmount();
        return totalRevenue != null ? totalRevenue : 0L;
    }
    
    public DailyRevenueResponse getDailyRevenue(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        List<Object[]> results = invoiceRepository.findDailyRevenueBetween(startDateTime, endDateTime);
        List<Map<String, Object>> dailyRevenues = new ArrayList<>();
        long totalRevenue = 0L;

        for (Object[] result : results) {
            Map<String, Object> dayRevenue = new HashMap<>();
            dayRevenue.put("date", result[0]);
            dayRevenue.put("revenue", result[1]);
            dailyRevenues.add(dayRevenue);
            totalRevenue += (Long) result[1];
        }

        return new DailyRevenueResponse(dailyRevenues, totalRevenue, "Doanh thu hàng ngày từ " + startDate + " đến " + endDate);
    }

    public AppointmentStatusPercentageResponse getAppointmentStatusPercentage() {
        long totalCompleted = appointmentRepository.countCompletedAppointments();
        long totalCancelled = appointmentRepository.countCancelledAppointments();
        long totalAppointments = totalCompleted + totalCancelled;
        
        double completedPercentage = totalAppointments > 0 ? 
            (double) totalCompleted / totalAppointments * 100 : 0.0;
        double cancelledPercentage = totalAppointments > 0 ? 
            (double) totalCancelled / totalAppointments * 100 : 0.0;
        
        return AppointmentStatusPercentageResponse.builder()
                .totalCompleted(totalCompleted)
                .totalCancelled(totalCancelled)
                .totalAppointments(totalAppointments)
                .completedPercentage(Math.round(completedPercentage * 100.0) / 100.0) // Làm tròn 2 chữ số thập phân
                .cancelledPercentage(Math.round(cancelledPercentage * 100.0) / 100.0) // Làm tròn 2 chữ số thập phân
                .build();
    }
} 