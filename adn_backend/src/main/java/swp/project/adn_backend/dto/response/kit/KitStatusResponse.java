package swp.project.adn_backend.dto.response.kit;

import jakarta.persistence.Column;
import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;

public class KitStatusResponse {

    String kitName;
    double price;
    LocalDate deliveryDate;
    LocalDate returnDate;
    DeliveryStatus kitStatus;

    public String getKitName() {
        return kitName;
    }

    public void setKitName(String kitName) {
        this.kitName = kitName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public DeliveryStatus getKitStatus() {
        return kitStatus;
    }

    public void setKitStatus(DeliveryStatus kitStatus) {
        this.kitStatus = kitStatus;
    }
}
