package swp.project.adn_backend.dto.InfoDTO;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class KitDeliveryStatusInfoByAppointmentDTO {
    private long kitDeliveryStatusId;
    private DeliveryStatus deliveryStatus;
    private LocalDate createOrderDate;
    private LocalDate returnDate;
    private long appointmentId;

    public KitDeliveryStatusInfoByAppointmentDTO(long kitDeliveryStatusId, DeliveryStatus deliveryStatus, LocalDate createOrderDate, LocalDate returnDate, long appointmentId) {
        this.kitDeliveryStatusId = kitDeliveryStatusId;
        this.deliveryStatus = deliveryStatus;
        this.createOrderDate = createOrderDate;
        this.returnDate = returnDate;
        this.appointmentId = appointmentId;
    }

    public long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(long appointmentId) {
        this.appointmentId = appointmentId;
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
