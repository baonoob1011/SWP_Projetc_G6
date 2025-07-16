package swp.project.adn_backend.dto.response.serviceResponse;

import swp.project.adn_backend.enums.ServiceType;

public class ServiceTestResponse {
    private long serviceId;
    private String serviceName;
    private String description;
    private ServiceType serviceType;
    private String image;

    public ServiceTestResponse() {
    }

    public ServiceTestResponse(long serviceId, String serviceName, String description, ServiceType serviceType, String image) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.description = description;
        this.serviceType = serviceType;
        this.image = image;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}