package swp.project.adn_backend.dto.InfoDTO;

import swp.project.adn_backend.enums.PaymentMethod;
import swp.project.adn_backend.enums.PaymentStatus;

public class PaymentInfoDTO {
    private long paymentId;
    private double amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus getPaymentStatus;

    public PaymentInfoDTO(long paymentId, double amount, PaymentMethod paymentMethod, PaymentStatus getPaymentStatus) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.getPaymentStatus = getPaymentStatus;
    }

    public long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(long paymentId) {
        this.paymentId = paymentId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getGetPaymentStatus() {
        return getPaymentStatus;
    }

    public void setGetPaymentStatus(PaymentStatus getPaymentStatus) {
        this.getPaymentStatus = getPaymentStatus;
    }
}
