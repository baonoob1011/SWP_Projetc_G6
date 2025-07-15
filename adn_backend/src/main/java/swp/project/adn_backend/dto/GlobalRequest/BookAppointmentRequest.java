package swp.project.adn_backend.dto.GlobalRequest;


import jakarta.validation.Valid;
import swp.project.adn_backend.dto.request.Location.LocationRequest;
import swp.project.adn_backend.dto.request.payment.PaymentRequest;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;
import swp.project.adn_backend.dto.request.serviceRequest.ServiceRequest;
import swp.project.adn_backend.dto.request.roleRequest.StaffRequest;
import swp.project.adn_backend.dto.request.appointment.AppointmentRequest;
import swp.project.adn_backend.dto.request.slot.SlotRequest;

import java.util.List;

public class BookAppointmentRequest {
    private AppointmentRequest appointmentRequest;
    private ServiceRequest serviceRequest;
    private StaffRequest staffRequest;
    private SlotRequest slotRequest;
    private LocationRequest locationRequest;
    private List<PatientRequest> patientRequestList;
    private PaymentRequest paymentRequest;

    public PaymentRequest getPaymentRequest() {
        return paymentRequest;
    }

    public void setPaymentRequest(PaymentRequest paymentRequest) {
        this.paymentRequest = paymentRequest;
    }

    public LocationRequest getLocationRequest() {
        return locationRequest;
    }

    public List<PatientRequest> getPatientRequestList() {
        return patientRequestList;
    }

    public void setPatientRequestList(List<PatientRequest> patientRequestList) {
        this.patientRequestList = patientRequestList;
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
