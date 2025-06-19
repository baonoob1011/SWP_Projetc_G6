package swp.project.adn_backend.dto.InfoDTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KitDeliveryStatusInfoDTO {
    private long kitDeliveryStatusId;
    private DeliveryStatus deliveryStatus;
    private LocalDate createOrderDate;
    private LocalDate returnDate;

    public KitDeliveryStatusInfoDTO(long kitDeliveryStatusId, DeliveryStatus deliveryStatus, LocalDate createOrderDate, LocalDate returnDate) {
        this.kitDeliveryStatusId = kitDeliveryStatusId;
        this.deliveryStatus = deliveryStatus;
        this.createOrderDate = createOrderDate;
        this.returnDate = returnDate;
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
