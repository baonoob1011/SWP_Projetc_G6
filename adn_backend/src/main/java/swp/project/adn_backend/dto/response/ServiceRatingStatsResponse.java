package swp.project.adn_backend.dto.response;

import java.util.List;

public class ServiceRatingStatsResponse {
    private List<ServiceRatingInfo> serviceRatings;
    private double overallAverageRating;
    private long totalServices;
    private long totalFeedbacks;
    private String description;

    public ServiceRatingStatsResponse() {}

    public ServiceRatingStatsResponse(List<ServiceRatingInfo> serviceRatings, 
                                    double overallAverageRating, 
                                    long totalServices, 
                                    long totalFeedbacks, 
                                    String description) {
        this.serviceRatings = serviceRatings;
        this.overallAverageRating = overallAverageRating;
        this.totalServices = totalServices;
        this.totalFeedbacks = totalFeedbacks;
        this.description = description;
    }

    public List<ServiceRatingInfo> getServiceRatings() {
        return serviceRatings;
    }

    public void setServiceRatings(List<ServiceRatingInfo> serviceRatings) {
        this.serviceRatings = serviceRatings;
    }

    public double getOverallAverageRating() {
        return overallAverageRating;
    }

    public void setOverallAverageRating(double overallAverageRating) {
        this.overallAverageRating = overallAverageRating;
    }

    public long getTotalServices() {
        return totalServices;
    }

    public void setTotalServices(long totalServices) {
        this.totalServices = totalServices;
    }

    public long getTotalFeedbacks() {
        return totalFeedbacks;
    }

    public void setTotalFeedbacks(long totalFeedbacks) {
        this.totalFeedbacks = totalFeedbacks;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Inner class cho thông tin đánh giá của từng service
    public static class ServiceRatingInfo {
        private long serviceId;
        private String serviceName;
        private double averageRating;
        private long totalFeedbacks;
        private String serviceType;

        public ServiceRatingInfo() {}

        public ServiceRatingInfo(long serviceId, String serviceName, 
                               double averageRating, long totalFeedbacks, String serviceType) {
            this.serviceId = serviceId;
            this.serviceName = serviceName;
            this.averageRating = averageRating;
            this.totalFeedbacks = totalFeedbacks;
            this.serviceType = serviceType;
        }

        public long getServiceId() {
            return serviceId;
        }

        public void setServiceId(long serviceId) {
            this.serviceId = serviceId;
        }

        public String getServiceName() {
            return serviceName;
        }

        public void setServiceName(String serviceName) {
            this.serviceName = serviceName;
        }

        public double getAverageRating() {
            return averageRating;
        }

        public void setAverageRating(double averageRating) {
            this.averageRating = averageRating;
        }

        public long getTotalFeedbacks() {
            return totalFeedbacks;
        }

        public void setTotalFeedbacks(long totalFeedbacks) {
            this.totalFeedbacks = totalFeedbacks;
        }

        public String getServiceType() {
            return serviceType;
        }

        public void setServiceType(String serviceType) {
            this.serviceType = serviceType;
        }
    }
} 