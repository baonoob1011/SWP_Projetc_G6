package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import swp.project.adn_backend.enums.PaymentMethod;
import swp.project.adn_backend.enums.PaymentStatus;

import java.time.LocalDate;
import java.util.List;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long paymentId;
    double amount;
    @Enumerated(EnumType.STRING)
    PaymentMethod paymentMethod;
    @Enumerated(EnumType.STRING)
    PaymentStatus getPaymentStatus;
    LocalDate transitionDate;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "user_id")
    Users users;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "appointment_id")
    Appointment appointment;

    @OneToMany(mappedBy = "payment", fetch = FetchType.EAGER, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    List<Invoice> invoices;

    public Payment() {
    }

    public Payment(long paymentId, double amount, PaymentMethod paymentMethod, PaymentStatus getPaymentStatus, LocalDate transitionDate, Users users, Appointment appointment) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.getPaymentStatus = getPaymentStatus;
        this.transitionDate = transitionDate;
        this.users = users;
        this.appointment = appointment;
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

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public PaymentStatus getPaymentStatus() {
        return getPaymentStatus;
    }

    public void setPaymentStatus(PaymentStatus getPaymentStatus) {
        this.getPaymentStatus = getPaymentStatus;
    }

    public LocalDate getTransitionDate() {
        return transitionDate;
    }

    public PaymentStatus getGetPaymentStatus() {
        return getPaymentStatus;
    }

    public void setGetPaymentStatus(PaymentStatus getPaymentStatus) {
        this.getPaymentStatus = getPaymentStatus;
    }

    public List<Invoice> getInvoices() {
        return invoices;
    }

    public void setInvoices(List<Invoice> invoices) {
        this.invoices = invoices;
    }

    public void setTransitionDate(LocalDate transitionDate) {
        this.transitionDate = transitionDate;
    }
}
