package swp.project.adn_backend.controller.dashboard;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.response.DashboardResponse;
import swp.project.adn_backend.dto.response.DailyRevenueResponse;
import swp.project.adn_backend.dto.response.ServiceRatingStatsResponse;
import swp.project.adn_backend.dto.response.TotalRevenueResponse;
import swp.project.adn_backend.dto.response.AppointmentStatusPercentageResponse;
import swp.project.adn_backend.dto.response.YearlyRevenueSummaryResponse;
import swp.project.adn_backend.service.dashboard.DashboardService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);
    private final DashboardService dashboardService;
    
    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardResponse> getDashboardStats() {
        try {
            DashboardResponse stats = dashboardService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/total-revenue")
    public ResponseEntity<TotalRevenueResponse> getTotalRevenue(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        try {
            Long revenue = dashboardService.getTotalRevenue(startDate, endDate);
            TotalRevenueResponse response = TotalRevenueResponse.builder()
                    .totalRevenue(revenue)
                    .currency("VND")
                    .description("Tổng doanh thu từ các giao dịch thành công")
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/service-ratings")
    public ResponseEntity<ServiceRatingStatsResponse> getServiceRatingStats() {
        try {
            ServiceRatingStatsResponse stats = dashboardService.getServiceRatingStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/appointment-status-percentage")
    public ResponseEntity<AppointmentStatusPercentageResponse> getAppointmentStatusPercentage() {
        try {
            AppointmentStatusPercentageResponse response = dashboardService.getAppointmentStatusPercentage();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/weekly-daily-revenue")
    public ResponseEntity<DailyRevenueResponse> getWeeklyDailyRevenue(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        if (startDate == null || endDate == null) {
            endDate = LocalDate.now();
            startDate = endDate.minusDays(6);
        }
        DailyRevenueResponse response = dashboardService.getDailyRevenue(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/yearly-revenue")
    public ResponseEntity<YearlyRevenueSummaryResponse> getYearlyRevenue(@RequestParam int year) {
        try {
            YearlyRevenueSummaryResponse response = dashboardService.getYearlyRevenueSummary(year);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 