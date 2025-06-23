package swp.project.adn_backend.dto.response.feedback;

import jakarta.persistence.Column;

public class ServiceFeedbackResponse {
    long serviceId;
    String serviceName;

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
}
