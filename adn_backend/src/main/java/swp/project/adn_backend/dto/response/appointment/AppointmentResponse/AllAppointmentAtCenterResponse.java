package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import java.util.List;

public class AllAppointmentAtCenterResponse {
    private List<PatientAppointmentResponse> patientAppointmentResponse;
    private List<PatientAppointmentFullInfoResponse> patientAppointmentFullInfoResponses;
    private List<StaffAppointmentResponse> staffAppointmentResponse;
    private List<UserAppointmentResponse> userAppointmentResponse;
    private ShowAppointmentResponse showAppointmentResponse;
    private List<SlotAppointmentResponse> slotAppointmentResponse;
    private List<ServiceAppointmentResponse> serviceAppointmentResponses;
    private List<LocationAppointmentResponse> locationAppointmentResponses;
    private RoomAppointmentResponse roomAppointmentResponse;
    private List<PriceAppointmentResponse> priceAppointmentResponse;
    private List<PaymentAppointmentResponse> paymentAppointmentResponse;
    private UserAppointmentResponse userAppointmentResponses;
    private KitAppointmentResponse kitAppointmentResponse;

    public KitAppointmentResponse getKitAppointmentResponse() {
        return kitAppointmentResponse;
    }

    public void setKitAppointmentResponse(KitAppointmentResponse kitAppointmentResponse) {
        this.kitAppointmentResponse = kitAppointmentResponse;
    }

    public UserAppointmentResponse getUserAppointmentResponses() {
        return userAppointmentResponses;
    }

    public void setUserAppointmentResponses(UserAppointmentResponse userAppointmentResponses) {
        this.userAppointmentResponses = userAppointmentResponses;
    }

    public AllAppointmentAtCenterResponse() {
    }


    public AllAppointmentAtCenterResponse(List<PatientAppointmentResponse> patientAppointmentResponse, List<PatientAppointmentFullInfoResponse> patientAppointmentFullInfoResponses, List<StaffAppointmentResponse> staffAppointmentResponse, List<UserAppointmentResponse> userAppointmentResponse, ShowAppointmentResponse showAppointmentResponse, List<SlotAppointmentResponse> slotAppointmentResponse, List<ServiceAppointmentResponse> serviceAppointmentResponses, List<LocationAppointmentResponse> locationAppointmentResponses, RoomAppointmentResponse roomAppointmentResponse, List<PriceAppointmentResponse> priceAppointmentResponse, List<PaymentAppointmentResponse> paymentAppointmentResponse) {
        this.patientAppointmentResponse = patientAppointmentResponse;
        this.patientAppointmentFullInfoResponses = patientAppointmentFullInfoResponses;
        this.staffAppointmentResponse = staffAppointmentResponse;
        this.userAppointmentResponse = userAppointmentResponse;
        this.showAppointmentResponse = showAppointmentResponse;
        this.slotAppointmentResponse = slotAppointmentResponse;
        this.serviceAppointmentResponses = serviceAppointmentResponses;
        this.locationAppointmentResponses = locationAppointmentResponses;
        this.roomAppointmentResponse = roomAppointmentResponse;
        this.priceAppointmentResponse = priceAppointmentResponse;
        this.paymentAppointmentResponse = paymentAppointmentResponse;
    }

    public List<PatientAppointmentFullInfoResponse> getPatientAppointmentFullInfoResponses() {
        return patientAppointmentFullInfoResponses;
    }

    public void setPatientAppointmentFullInfoResponses(List<PatientAppointmentFullInfoResponse> patientAppointmentFullInfoResponses) {
        this.patientAppointmentFullInfoResponses = patientAppointmentFullInfoResponses;
    }

    public List<PaymentAppointmentResponse> getPaymentAppointmentResponse() {
        return paymentAppointmentResponse;
    }

    public void setPaymentAppointmentResponse(List<PaymentAppointmentResponse> paymentAppointmentResponse) {
        this.paymentAppointmentResponse = paymentAppointmentResponse;
    }

    public List<PriceAppointmentResponse> getPriceAppointmentResponse() {
        return priceAppointmentResponse;
    }

    public void setPriceAppointmentResponse(List<PriceAppointmentResponse> priceAppointmentResponse) {
        this.priceAppointmentResponse = priceAppointmentResponse;
    }

    public List<LocationAppointmentResponse> getLocationAppointmentResponses() {
        return locationAppointmentResponses;
    }

    public RoomAppointmentResponse getRoomAppointmentResponse() {
        return roomAppointmentResponse;
    }

    public void setRoomAppointmentResponse(RoomAppointmentResponse roomAppointmentResponse) {
        this.roomAppointmentResponse = roomAppointmentResponse;
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
