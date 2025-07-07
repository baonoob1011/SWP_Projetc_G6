package swp.project.adn_backend.dto.request.Kit;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateKitRequest {
    String kitCode;
    String kitName;
    String targetPersonCount;
    Double  price;
    String contents;
    DeliveryStatus kitStatus;
    LocalDate deliveryDate;
    LocalDate returnDate;


    public String getKitCode() {
        return kitCode;
    }

    public void setKitCode(String kitCode) {
        this.kitCode = kitCode;
    }

    public String getKitName() {
        return kitName;
    }

    public void setKitName(String kitName) {
        this.kitName = kitName;
    }

    public String getTargetPersonCount() {
        return targetPersonCount;
    }

    public void setTargetPersonCount(String targetPersonCount) {
        this.targetPersonCount = targetPersonCount;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public DeliveryStatus getKitStatus() {
        return kitStatus;
    }

    public void setKitStatus(DeliveryStatus kitStatus) {
        this.kitStatus = kitStatus;
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
}
