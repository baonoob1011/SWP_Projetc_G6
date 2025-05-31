package swp.project.adn_backend.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public class ServiceRequest {

    @NotBlank(message = "Service name is required")
    @Size(max = 100, message = "Service name must be at most 100 characters")
    private String serviceName;

    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must be at most 255 characters")
    private String description;

    @NotBlank(message = "Service type is required")
    @Pattern(regexp = "^(Hành Chính|Dân sự)$", message = "Service type must be either 'Hành Chính' or 'Dân sự'")
    private String serviceType;

    private boolean isActive;

    private String image;

    public ServiceRequest(String serviceName, String description, String serviceType, boolean isActive, String image) {
        this.serviceName = serviceName;
        this.description = description;
        this.serviceType = serviceType;
        this.isActive = isActive;
        this.image = image;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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

    public @NotBlank(message = "Service type is required") @Pattern(regexp = "^(Hành Chính|Dân sự)$", message = "Service type must be either 'Hành Chính' or 'Dân sự'") String getServiceType() {
        return serviceType;
    }

    public void setServiceType(@NotBlank(message = "Service type is required") @Pattern(regexp = "^(Hành Chính|Dân sự)$", message = "Service type must be either 'Hành Chính' or 'Dân sự'") String serviceType) {
        this.serviceType = serviceType;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
