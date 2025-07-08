package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import java.util.List;

public class AllAppointmentAtHomeResponse {
    private List<PatientAppointmentResponse> patientAppointmentResponse;
    private List<UserAppointmentResponse> userAppointmentResponse;
    private ShowAppointmentResponse showAppointmentResponse;
    private List<ServiceAppointmentResponse> serviceAppointmentResponses;
    private KitAppointmentResponse kitAppointmentResponse;
    private List<PriceAppointmentResponse> priceAppointmentResponse;
    private List<PaymentAppointmentResponse> paymentAppointmentResponses;
    private List<StaffAppointmentResponse> staffAppointmentResponse;

    public List<StaffAppointmentResponse> getStaffAppointmentResponse() {
        return staffAppointmentResponse;
    }

    public void setStaffAppointmentResponse(List<StaffAppointmentResponse> staffAppointmentResponse) {
        this.staffAppointmentResponse = staffAppointmentResponse;
    }

    private UserAppointmentResponse userAppointmentResponses;

    public AllAppointmentAtHomeResponse() {
    }

    public UserAppointmentResponse getUserAppointmentResponses() {
        return userAppointmentResponses;
    }

    public void setUserAppointmentResponses(UserAppointmentResponse userAppointmentResponses) {
        this.userAppointmentResponses = userAppointmentResponses;
    }

    public AllAppointmentAtHomeResponse(List<PatientAppointmentResponse> patientAppointmentResponse, List<UserAppointmentResponse> userAppointmentResponse, ShowAppointmentResponse showAppointmentResponse, List<ServiceAppointmentResponse> serviceAppointmentResponses, KitAppointmentResponse kitAppointmentResponse, List<PriceAppointmentResponse> priceAppointmentResponse, List<PaymentAppointmentResponse> paymentAppointmentResponses) {
        this.patientAppointmentResponse = patientAppointmentResponse;
        this.userAppointmentResponse = userAppointmentResponse;
        this.showAppointmentResponse = showAppointmentResponse;
        this.serviceAppointmentResponses = serviceAppointmentResponses;
        this.kitAppointmentResponse = kitAppointmentResponse;
        this.priceAppointmentResponse = priceAppointmentResponse;
        this.paymentAppointmentResponses = paymentAppointmentResponses;
    }

    public List<PaymentAppointmentResponse> getPaymentAppointmentResponses() {
        return paymentAppointmentResponses;
    }

    public void setPaymentAppointmentResponses(List<PaymentAppointmentResponse> paymentAppointmentResponses) {
        this.paymentAppointmentResponses = paymentAppointmentResponses;
    }

    public List<PriceAppointmentResponse> getPriceAppointmentResponse() {
        return priceAppointmentResponse;
    }

    public void setPriceAppointmentResponse(List<PriceAppointmentResponse> priceAppointmentResponse) {
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
