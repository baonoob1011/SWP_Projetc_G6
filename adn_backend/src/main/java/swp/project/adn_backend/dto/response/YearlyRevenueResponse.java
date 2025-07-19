package swp.project.adn_backend.dto.response;

import java.util.List;
import java.util.Map;

public class YearlyRevenueResponse {

    private List<Map<String, Object>> yearlyRevenues;
    private Long totalRevenue;
    private String description;

    public YearlyRevenueResponse(List<Map<String, Object>> yearlyRevenues, Long totalRevenue, String description) {
        this.yearlyRevenues = yearlyRevenues;
        this.totalRevenue = totalRevenue;
        this.description = description;
    }

    // Getters and Setters
    public List<Map<String, Object>> getYearlyRevenues() {
        return yearlyRevenues;
    }

    public void setYearlyRevenues(List<Map<String, Object>> yearlyRevenues) {
        this.yearlyRevenues = yearlyRevenues;
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