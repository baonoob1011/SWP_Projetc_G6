package swp.project.adn_backend.dto.response.serviceResponse;

import jakarta.persistence.*;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ServiceType;

import java.time.LocalDate;

public class GetAllServiceResponse {
    long serviceId;
    String serviceName;
    LocalDate registerDate;
    String description;
    private ServiceType serviceType;
    boolean isActive;
    private String image;


    public GetAllServiceResponse(long serviceId, String serviceName, LocalDate registerDate, String description, ServiceType serviceType, boolean isActive, String image) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.registerDate = registerDate;
        this.description = description;
        this.serviceType = serviceType;
        this.isActive = isActive;
        this.image = image;
    }

    public long getServiceId() {
        return serviceId;
    }

    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }

    public GetAllServiceResponse() {
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public LocalDate getRegisterDate() {
        return registerDate;
    }

    public void setRegisterDate(LocalDate registerDate) {
        this.registerDate = registerDate;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

}
