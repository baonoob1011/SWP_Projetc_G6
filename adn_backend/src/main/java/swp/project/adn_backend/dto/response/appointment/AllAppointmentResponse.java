package swp.project.adn_backend.dto.response.appointment;

import java.util.List;

public class AllAppointmentResponse {
    private List<PatientAppointmentResponse> patientAppointmentResponse;
    private List<StaffAppointmentResponse> staffAppointmentResponse;
    private List<UserAppointmentResponse> userAppointmentResponse;
    private ShowAppointmentResponse showAppointmentResponse;
    private List<SlotAppointmentResponse> slotAppointmentResponse;
    private List<ServiceAppointmentResponse> serviceAppointmentResponses;
    private List<LocationAppointmentResponse> locationAppointmentResponses;

    public AllAppointmentResponse() {
    }

    public AllAppointmentResponse(List<PatientAppointmentResponse> patientAppointmentResponse, List<StaffAppointmentResponse> staffAppointmentResponse, List<UserAppointmentResponse> userAppointmentResponse, ShowAppointmentResponse showAppointmentResponse, List<SlotAppointmentResponse> slotAppointmentResponse, List<ServiceAppointmentResponse> serviceAppointmentResponses, List<LocationAppointmentResponse> locationAppointmentResponses) {
        this.patientAppointmentResponse = patientAppointmentResponse;
        this.staffAppointmentResponse = staffAppointmentResponse;
        this.userAppointmentResponse = userAppointmentResponse;
        this.showAppointmentResponse = showAppointmentResponse;
        this.slotAppointmentResponse = slotAppointmentResponse;
        this.serviceAppointmentResponses = serviceAppointmentResponses;
        this.locationAppointmentResponses = locationAppointmentResponses;
    }

    public List<LocationAppointmentResponse> getLocationAppointmentResponses() {
        return locationAppointmentResponses;
    }

    public void setLocationAppointmentResponses(List<LocationAppointmentResponse> locationAppointmentResponses) {
        this.locationAppointmentResponses = locationAppointmentResponses;
    }

    public List<ServiceAppointmentResponse> getServiceAppointmentResponses() {
        return serviceAppointmentResponses;
    }

    public void setServiceAppointmentResponses(List<ServiceAppointmentResponse> serviceAppointmentResponses) {
        this.serviceAppointmentResponses = serviceAppointmentResponses;
    }

    public List<PatientAppointmentResponse> getPatientAppointmentResponse() {
        return patientAppointmentResponse;
    }

    public void setPatientAppointmentResponse(List<PatientAppointmentResponse> patientAppointmentResponse) {
        this.patientAppointmentResponse = patientAppointmentResponse;
    }

    public void setShowAppointmentResponse(ShowAppointmentResponse showAppointmentResponse) {
        this.showAppointmentResponse = showAppointmentResponse;
    }

    public List<StaffAppointmentResponse> getStaffAppointmentResponse() {
        return staffAppointmentResponse;
    }

    public void setStaffAppointmentResponse(List<StaffAppointmentResponse> staffAppointmentResponse) {
        this.staffAppointmentResponse = staffAppointmentResponse;
    }

    public List<UserAppointmentResponse> getUserAppointmentResponse() {
        return userAppointmentResponse;
    }

    public void setUserAppointmentResponse(List<UserAppointmentResponse> userAppointmentResponse) {
        this.userAppointmentResponse = userAppointmentResponse;
    }

    public ShowAppointmentResponse getShowAppointmentResponse() {
        return showAppointmentResponse;
    }

    public List<SlotAppointmentResponse> getSlotAppointmentResponse() {
        return slotAppointmentResponse;
    }

    public void setSlotAppointmentResponse(List<SlotAppointmentResponse> slotAppointmentResponse) {
        this.slotAppointmentResponse = slotAppointmentResponse;
    }
}
