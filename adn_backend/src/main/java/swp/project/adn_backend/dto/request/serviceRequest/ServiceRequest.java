package swp.project.adn_backend.dto.request.serviceRequest;

import jakarta.validation.constraints.*;
import swp.project.adn_backend.enums.ServiceType;

public class ServiceRequest {

    long serviceId;
    @NotBlank(message = "Service name is required")
    @Size(max = 100, message = "Service name must be at most 100 characters")
    private String serviceName;

    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must be at most 255 characters")
    private String description;

    private ServiceType serviceType;


    private boolean isActive;

    private String image;


    public ServiceRequest() {
    }

    public ServiceRequest(String serviceName, String description, ServiceType serviceType, boolean isActive) {
        this.serviceName = serviceName;
        this.description = description;
        this.serviceType = serviceType;
        this.isActive = isActive;
    }


    public @NotBlank(message = "Service name is required") @Size(max = 100, message = "Service name must be at most 100 characters") String getServiceName() {
        return serviceName;
    }

    public void setServiceName(@NotBlank(message = "Service name is required") @Size(max = 100, message = "Service name must be at most 100 characters") String serviceName) {
        this.serviceName = serviceName;
    }


    public @NotBlank(message = "Description is required") @Size(max = 255, message = "Description must be at most 255 characters") String getDescription() {
        return description;
    }

    public void setDescription(@NotBlank(message = "Description is required") @Size(max = 255, message = "Description must be at most 255 characters") String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public long getServiceId() {
        return serviceId;
    }

    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

}
