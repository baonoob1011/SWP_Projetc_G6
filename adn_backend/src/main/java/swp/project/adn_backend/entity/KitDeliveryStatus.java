package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;

@Entity
@Table(name = "kit_delivery_status")
public class KitDeliveryStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long kitDeliveryStatusId;
    @Enumerated(EnumType.STRING)
    private DeliveryStatus deliveryStatus;
    private LocalDate createOrderDate;
    private LocalDate returnDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kit_id") // FK to appointment table
    private Kit kit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // FK to appointment table
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id") // FK to appointment table
    private Staff staff;

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
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

    public Kit getKit() {
        return kit;
    }

    public void setKit(Kit kit) {
        this.kit = kit;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public long getKitDeliveryStatusId() {
        return kitDeliveryStatusId;
    }

    public void setKitDeliveryStatusId(long kitDeliveryStatusId) {
        this.kitDeliveryStatusId = kitDeliveryStatusId;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public LocalDate getCreateOrderDate() {
        return createOrderDate;
    }

    public void setCreateOrderDate(LocalDate createOrderDate) {
        this.createOrderDate = createOrderDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }
}
