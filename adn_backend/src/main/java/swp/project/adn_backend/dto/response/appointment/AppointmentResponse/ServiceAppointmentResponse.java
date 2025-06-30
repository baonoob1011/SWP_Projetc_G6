package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.ServiceType;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceAppointmentResponse {
    long serviceId;
    String serviceName;
    LocalDate registerDate;
    String description;
    private ServiceType serviceType;

    public ServiceAppointmentResponse() {
    }

    public ServiceAppointmentResponse(long serviceId, String serviceName, LocalDate registerDate, String description, ServiceType serviceType) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.registerDate = registerDate;
        this.description = description;
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
}
