package swp.project.adn_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.apache.catalina.User;
import swp.project.adn_backend.enums.PaymentMethod;
import swp.project.adn_backend.enums.PaymentStatus;

import java.time.LocalDate;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long paymentId;
    double amount;
    PaymentMethod method;
    PaymentStatus paymentStatus;
    LocalDate transitionDate;

   
    public Payment(long paymentId, double amount, PaymentMethod method, PaymentStatus paymentStatus, LocalDate transitionDate) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.method = method;
        this.paymentStatus = paymentStatus;
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

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDate getTransitionDate() {
        return transitionDate;
    }

    public void setTransitionDate(LocalDate transitionDate) {
        this.transitionDate = transitionDate;
    }
}
