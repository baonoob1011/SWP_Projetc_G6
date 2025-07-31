package swp.project.adn_backend.service.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.response.DashboardResponse;
import swp.project.adn_backend.dto.response.DailyRevenueResponse;
import swp.project.adn_backend.dto.response.YearlyRevenueResponse;
import swp.project.adn_backend.dto.response.ServiceRatingStatsResponse;
import swp.project.adn_backend.dto.response.AppointmentStatusPercentageResponse;
import swp.project.adn_backend.dto.response.YearlyRevenueSummaryResponse;
import swp.project.adn_backend.repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
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
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final ManagerRepository managerRepository;



    @Autowired
    public DashboardService(UserRepository userRepository, InvoiceRepository invoiceRepository,
                          FeedbackRepository feedbackRepository, ServiceTestRepository serviceTestRepository,
                          AppointmentRepository appointmentRepository, PatientRepository patientRepository, StaffRepository staffRepository, ManagerRepository managerRepository) {
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
        this.feedbackRepository = feedbackRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.managerRepository = managerRepository;
    }
    
    
    public DashboardResponse getDashboardStats() {
        long totalUsers = userRepository.count() - userRepository.countUsersByAdminRole()-staffRepository.countUsersByStaffRole()-managerRepository.count();
        long activeUsers = userRepository.countActiveUsers() - userRepository.countUsersByAdminRole()-staffRepository.countUsersByStaffRole()-managerRepository.count();
        long inactiveUsers = userRepository.countInactiveUsers();
        long totalPatients = patientRepository.count();
        long totalStaff = staffRepository.countUsersByStaffRole();
        long totalManagers = managerRepository.count();
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
        Map<LocalDate, Long> revenueMap = new HashMap<>();
        long totalRevenue = 0L;

        // Đưa dữ liệu từ DB vào map để tra cứu nhanh
        for (Object[] result : results) {
            java.sql.Date sqlDate = (java.sql.Date) result[0];
            LocalDate date = sqlDate.toLocalDate();
            Long revenue = (Long) result[1];
            revenueMap.put(date, revenue);
            totalRevenue += revenue;
        }

        // Tạo list đủ ngày, ngày nào không có thì revenue = 0
        List<Map<String, Object>> dailyRevenues = new ArrayList<>();
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            Map<String, Object> dayRevenue = new HashMap<>();
            dayRevenue.put("date", current);
            dayRevenue.put("revenue", revenueMap.getOrDefault(current, 0L));
            dailyRevenues.add(dayRevenue);
            current = current.plusDays(1);
        }

        return new DailyRevenueResponse(dailyRevenues, totalRevenue, "Doanh thu hàng ngày từ " + startDate + " đến " + endDate);
    }

    public YearlyRevenueResponse getYearlyRevenue(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        List<Object[]> results = invoiceRepository.findYearlyRevenueBetween(startDateTime, endDateTime);
        Map<Integer, Long> revenueMap = new HashMap<>();
        long totalRevenue = 0L;

        // Đưa dữ liệu từ DB vào map để tra cứu nhanh
        for (Object[] result : results) {
            Integer year = (Integer) result[0];
            Long revenue = (Long) result[1];
            revenueMap.put(year, revenue);
            totalRevenue += revenue;
        }

        // Tạo list đủ năm, năm nào không có thì revenue = 0
        List<Map<String, Object>> yearlyRevenues = new ArrayList<>();
        int startYear = startDate.getYear();
        int endYear = endDate.getYear();

        for (int year = startYear; year <= endYear; year++) {
            Map<String, Object> yearRevenue = new HashMap<>();
            yearRevenue.put("year", year);
            yearRevenue.put("revenue", revenueMap.getOrDefault(year, 0L));
            yearlyRevenues.add(yearRevenue);
        }

        return new YearlyRevenueResponse(yearlyRevenues, totalRevenue, "Doanh thu theo năm từ " + startDate + " đến " + endDate);
    }

    public AppointmentStatusPercentageResponse getAppointmentStatusPercentage() {
        long totalCompleted = appointmentRepository.countCompletedAppointments();
        long totalCancelled = appointmentRepository.countCancelledAppointments();
        long totalPending = appointmentRepository.countPendingAppointments();
        long totalConfirmed = appointmentRepository.countConfirmedAppointments();
        long totalRated = appointmentRepository.countRatedAppointments();
        
        long totalAppointments = totalCompleted + totalCancelled + totalPending + totalConfirmed + totalRated;
        
        double completedPercentage = totalAppointments > 0 ? 
            (double) totalCompleted / totalAppointments * 100 : 0.0;
        double cancelledPercentage = totalAppointments > 0 ? 
            (double) totalCancelled / totalAppointments * 100 : 0.0;
        
        return AppointmentStatusPercentageResponse.builder()
                .totalCompleted(totalCompleted)
                .totalCancelled(totalCancelled)
                .totalAppointments(totalAppointments)
                .completedPercentage(Math.round(completedPercentage * 100.0) / 100.0)
                .cancelledPercentage(Math.round(cancelledPercentage * 100.0) / 100.0)
                .build();
    }

    public YearlyRevenueSummaryResponse getYearlyRevenueSummary(int year) {
        int currentYear = java.time.LocalDate.now().getYear();
        int lastMonth = (year == currentYear) ? java.time.LocalDate.now().getMonthValue() : 12;
        List<YearlyRevenueSummaryResponse.MonthlyRevenue> monthlyRevenues = new ArrayList<>();
        long total = 0L;
        for (int month = 1; month <= lastMonth; month++) {
            java.time.LocalDateTime start = java.time.LocalDate.of(year, month, 1).atStartOfDay();
            java.time.LocalDateTime end = java.time.YearMonth.of(year, month).atEndOfMonth().atTime(java.time.LocalTime.MAX);
            Long revenue = invoiceRepository.sumRevenueBetween(start, end);
            if (revenue == null) revenue = 0L;
            monthlyRevenues.add(new YearlyRevenueSummaryResponse.MonthlyRevenue(month, revenue));
            total += revenue;
        }
        return new YearlyRevenueSummaryResponse(year, monthlyRevenues, total);
    }
} 