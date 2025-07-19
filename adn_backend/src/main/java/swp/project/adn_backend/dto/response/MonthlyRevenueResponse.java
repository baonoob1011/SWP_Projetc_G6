package swp.project.adn_backend.dto.response;

import java.util.List;
import java.util.Map;

public class MonthlyRevenueResponse {

    private List<Map<String, Object>> monthlyRevenues;
    private Long totalRevenue;
    private String description;

    public MonthlyRevenueResponse(List<Map<String, Object>> monthlyRevenues, Long totalRevenue, String description) {
        this.monthlyRevenues = monthlyRevenues;
        this.totalRevenue = totalRevenue;
        this.description = description;
    }

    // Getters and Setters
    public List<Map<String, Object>> getMonthlyRevenues() {
        return monthlyRevenues;
    }

    public void setMonthlyRevenues(List<Map<String, Object>> monthlyRevenues) {
        this.monthlyRevenues = monthlyRevenues;
    }

    public Long getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Long totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
} 