package swp.project.adn_backend.dto.response.kit;

import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;

public class KitDeliveryStatusResponse {
    private DeliveryStatus deliveryStatus;
    private LocalDate createOrderDate;
    private LocalDate returnDate;

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
