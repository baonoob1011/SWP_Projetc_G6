package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import java.util.List;

public class AllAppointmentAtHomeResponse {
    private List<PatientAppointmentResponse> patientAppointmentResponse;
    private List<UserAppointmentResponse> userAppointmentResponse;
    private ShowAppointmentResponse showAppointmentResponse;
    private List<ServiceAppointmentResponse> serviceAppointmentResponses;
    private KitAppointmentResponse kitAppointmentResponse;
    private PriceAppointmentResponse priceAppointmentResponse;

    public AllAppointmentAtHomeResponse() {
    }

    public AllAppointmentAtHomeResponse(List<PatientAppointmentResponse> patientAppointmentResponse, List<UserAppointmentResponse> userAppointmentResponse, ShowAppointmentResponse showAppointmentResponse, List<ServiceAppointmentResponse> serviceAppointmentResponses, KitAppointmentResponse kitAppointmentResponse, PriceAppointmentResponse priceAppointmentResponse) {
        this.patientAppointmentResponse = patientAppointmentResponse;
        this.userAppointmentResponse = userAppointmentResponse;
        this.showAppointmentResponse = showAppointmentResponse;
        this.serviceAppointmentResponses = serviceAppointmentResponses;
        this.kitAppointmentResponse = kitAppointmentResponse;
        this.priceAppointmentResponse = priceAppointmentResponse;
    }

    public PriceAppointmentResponse getPriceAppointmentResponse() {
        return priceAppointmentResponse;
    }

    public void setPriceAppointmentResponse(PriceAppointmentResponse priceAppointmentResponse) {
        this.priceAppointmentResponse = priceAppointmentResponse;
    }

    public KitAppointmentResponse getKitAppointmentResponse() {
        return kitAppointmentResponse;
    }

    public void setKitAppointmentResponse(KitAppointmentResponse kitAppointmentResponse) {
        this.kitAppointmentResponse = kitAppointmentResponse;
    }

    public ShowAppointmentResponse getShowAppointmentResponse() {
        return showAppointmentResponse;
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


    public List<UserAppointmentResponse> getUserAppointmentResponse() {
        return userAppointmentResponse;
    }

    public void setUserAppointmentResponse(List<UserAppointmentResponse> userAppointmentResponse) {
        this.userAppointmentResponse = userAppointmentResponse;
    }


}
