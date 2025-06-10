package swp.project.adn_backend.dto.GlobalRequest;


import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.dto.request.serviceRequest.ServiceRequest;
import swp.project.adn_backend.dto.request.roleRequest.StaffRequest;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.request.slot.SlotRequest;

public class BookAppointmentRequest {
    private AppointmentRequest appointmentRequest;
    private ServiceRequest serviceRequest;
    private StaffRequest staffRequest;
    private SlotRequest slotRequest;
    private LocationRequest locationRequest;


    public LocationRequest getLocationRequest() {
        return locationRequest;
    }

    public void setLocationRequest(LocationRequest locationRequest) {
        this.locationRequest = locationRequest;
    }

    public AppointmentRequest getAppointmentRequest() {
        return appointmentRequest;
    }

    public void setAppointmentRequest(AppointmentRequest appointmentRequest) {
        this.appointmentRequest = appointmentRequest;
    }

    public ServiceRequest getServiceRequest() {
        return serviceRequest;
    }

    public void setServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public StaffRequest getStaffRequest() {
        return staffRequest;
    }

    public void setStaffRequest(StaffRequest staffRequest) {
        this.staffRequest = staffRequest;
    }

    public SlotRequest getSlotRequest() {
        return slotRequest;
    }

    public void setSlotRequest(SlotRequest slotRequest) {
        this.slotRequest = slotRequest;
    }
}
