package swp.project.adn_backend.dto.request.payment;

import swp.project.adn_backend.enums.PaymentMethod;

public class PaymentRequest {
    private PaymentMethod paymentMethod;

    public PaymentRequest() {
    }

    public PaymentRequest(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
