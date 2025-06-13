package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.PaymentMethod;
import swp.project.adn_backend.enums.PaymentStatus;

import java.time.LocalDate;
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentAppointmentResponse {
    long paymentId;
    double amount;
    PaymentMethod paymentMethod;
    PaymentStatus getPaymentStatus;
    LocalDate transitionDate;

    public PaymentAppointmentResponse() {
    }

    public PaymentAppointmentResponse(long paymentId, double amount, PaymentMethod paymentMethod, PaymentStatus getPaymentStatus, LocalDate transitionDate) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.getPaymentStatus = getPaymentStatus;
        this.transitionDate = transitionDate;
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

    public LocalDate getTransitionDate() {
        return transitionDate;
    }

    public void setTransitionDate(LocalDate transitionDate) {
        this.transitionDate = transitionDate;
    }
}
