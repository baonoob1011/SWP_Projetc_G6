package swp.project.adn_backend.dto.GlobalRequest;


import swp.project.adn_backend.dto.request.ServiceRequest;
import swp.project.adn_backend.dto.request.StaffRequest;
import swp.project.adn_backend.dto.request.serviceRequest.AppointmentRequest;
import swp.project.adn_backend.dto.request.serviceRequest.SlotRequest;

public class BookAppointmentRequest {
    private AppointmentRequest appointmentRequest;
    private ServiceRequest serviceRequest;
    private StaffRequest staffRequest;
    private SlotRequest slotRequest;

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
