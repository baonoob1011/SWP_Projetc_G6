package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import java.util.List;

public class AllAppointmentAtCenterUserResponse {
    private UserAppointmentResponse userAppointmentResponse;
    private ShowAppointmentResponse showAppointmentResponse;
    private ServiceAppointmentResponse serviceAppointmentResponses;
    private List<PriceAppointmentResponse> priceAppointmentResponse;
    private List<PaymentAppointmentResponse> paymentAppointmentResponse;

    public AllAppointmentAtCenterUserResponse() {
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

    public UserAppointmentResponse getUserAppointmentResponse() {
        return userAppointmentResponse;
    }

    public void setUserAppointmentResponse(UserAppointmentResponse userAppointmentResponse) {
        this.userAppointmentResponse = userAppointmentResponse;
    }

    public ServiceAppointmentResponse getServiceAppointmentResponses() {
        return serviceAppointmentResponses;
    }

    public void setServiceAppointmentResponses(ServiceAppointmentResponse serviceAppointmentResponses) {
        this.serviceAppointmentResponses = serviceAppointmentResponses;
    }

    public void setShowAppointmentResponse(ShowAppointmentResponse showAppointmentResponse) {
        this.showAppointmentResponse = showAppointmentResponse;
    }




    public ShowAppointmentResponse getShowAppointmentResponse() {
        return showAppointmentResponse;
    }


}
