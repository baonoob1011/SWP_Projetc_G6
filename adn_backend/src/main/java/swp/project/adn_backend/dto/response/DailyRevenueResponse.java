package swp.project.adn_backend.dto.response;

import java.util.List;
import java.util.Map;

public class DailyRevenueResponse {

    private List<Map<String, Object>> dailyRevenues;
    private Long totalRevenue;
    private String description;

    public DailyRevenueResponse(List<Map<String, Object>> dailyRevenues, Long totalRevenue, String description) {
        this.dailyRevenues = dailyRevenues;
        this.totalRevenue = totalRevenue;
        this.description = description;
    }

    // Getters and Setters
    public List<Map<String, Object>> getDailyRevenues() {
        return dailyRevenues;
    }

    public void setDailyRevenues(List<Map<String, Object>> dailyRevenues) {
        this.dailyRevenues = dailyRevenues;
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