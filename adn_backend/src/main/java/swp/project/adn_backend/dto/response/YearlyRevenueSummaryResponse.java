package swp.project.adn_backend.dto.response;

import java.util.List;

public class YearlyRevenueSummaryResponse {
    private int year;
    private List<MonthlyRevenue> monthlyRevenues;
    private long totalRevenue;

    public YearlyRevenueSummaryResponse(int year, List<MonthlyRevenue> monthlyRevenues, long totalRevenue) {
        this.year = year;
        this.monthlyRevenues = monthlyRevenues;
        this.totalRevenue = totalRevenue;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public List<MonthlyRevenue> getMonthlyRevenues() {
        return monthlyRevenues;
    }

    public void setMonthlyRevenues(List<MonthlyRevenue> monthlyRevenues) {
        this.monthlyRevenues = monthlyRevenues;
    }

    public long getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(long totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public static class MonthlyRevenue {
        private int month; // 1-12
        private long revenue;

        public MonthlyRevenue(int month, long revenue) {
            this.month = month;
            this.revenue = revenue;
        }

        public int getMonth() {
            return month;
        }

        public void setMonth(int month) {
            this.month = month;
        }

        public long getRevenue() {
            return revenue;
        }

        public void setRevenue(long revenue) {
            this.revenue = revenue;
        }
    }
} 