package swp.project.adn_backend.dto.GlobalRequest;

import jakarta.validation.Valid;
import swp.project.adn_backend.dto.request.*;
import swp.project.adn_backend.dto.request.serviceRequest.AppointmentRequest;
import swp.project.adn_backend.dto.request.serviceRequest.SlotRequest;

public class CreateServiceRequest {

    private ServiceRequest serviceRequest;

    @Valid
    private PriceListRequest priceListRequest;
    private SlotRequest slotRequest;
    private AppointmentRequest appointmentRequest;
    private StaffRequest staffRequest;

    private AdministrativeServiceRequest administrativeServiceRequest;

    private CivilServiceRequest civilServiceRequest;


    public CivilServiceRequest getCivilServiceRequest() {
        return civilServiceRequest;
    }

    public void setCivilServiceRequest(CivilServiceRequest civilServiceRequest) {
        this.civilServiceRequest = civilServiceRequest;
    }

    public SlotRequest getSlotRequest() {
        return slotRequest;
    }

    public void setSlotRequest(SlotRequest slotRequest) {
        this.slotRequest = slotRequest;
    }

    public AdministrativeServiceRequest getAdministrativeServiceRequest() {
        return administrativeServiceRequest;
    }

    public void setAdministrativeServiceRequest(AdministrativeServiceRequest administrativeServiceRequest) {
        this.administrativeServiceRequest = administrativeServiceRequest;
    }

    public StaffRequest getStaffRequest() {
        return staffRequest;
    }

    public void setStaffRequest(StaffRequest staffRequest) {
        this.staffRequest = staffRequest;
    }

    // Getters và setters
    public ServiceRequest getServiceRequest() {
        return serviceRequest;
    }

    public void setServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public PriceListRequest getPriceListRequest() {
        return priceListRequest;
    }

    public AppointmentRequest getAppointmentRequest() {
        return appointmentRequest;
    }

    public void setAppointmentRequest(AppointmentRequest appointmentRequest) {
        this.appointmentRequest = appointmentRequest;
    }

    public void setPriceListRequest(PriceListRequest priceListRequest) {
        this.priceListRequest = priceListRequest;
    }
}
