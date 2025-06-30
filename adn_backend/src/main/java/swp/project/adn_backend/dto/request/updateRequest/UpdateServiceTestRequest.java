package swp.project.adn_backend.dto.request.updateRequest;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.ServiceType;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateServiceTestRequest {
    String serviceName;
    LocalDate registerDate;
    String description;
    private ServiceType serviceType;
    private String image;

    public UpdateServiceTestRequest(String serviceName, LocalDate registerDate, String description, ServiceType serviceType, String image) {
        this.serviceName = serviceName;
        this.registerDate = registerDate;
        this.description = description;
        this.serviceType = serviceType;
        this.image = image;
    }

    public UpdateServiceTestRequest() {
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



    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
