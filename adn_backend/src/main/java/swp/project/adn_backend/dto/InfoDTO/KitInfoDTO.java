package swp.project.adn_backend.dto.InfoDTO;

import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class KitInfoDTO {
    long kitId;
    String kitCode;
    String kitName;
    String targetPersonCount;
    double price;
    String contents;
    DeliveryStatus kitStatus;
    LocalDate deliveryDate;
    LocalDate returnDate;

    public KitInfoDTO(long kitId, String kitCode, String kitName, String targetPersonCount, double price, String contents, DeliveryStatus kitStatus, LocalDate deliveryDate, LocalDate returnDate) {
        this.kitId = kitId;
        this.kitCode = kitCode;
        this.kitName = kitName;
        this.targetPersonCount = targetPersonCount;
        this.price = price;
        this.contents = contents;
        this.kitStatus = kitStatus;
        this.deliveryDate = deliveryDate;
        this.returnDate = returnDate;
    }

    //    public KitInfoDTO(long kitId, String kitCode, String kitName, DeliveryStatus kitStatus, LocalDate delivery_date, LocalDate return_date) {
//        this.kitId = kitId;
//        this.kitCode = kitCode;
//        this.kitName = kitName;
//        this.kitStatus = kitStatus;
//        this.delivery_date = delivery_date;
//        this.return_date = return_date;
//    }

    public long getKitId() {
        return kitId;
    }

    public void setKitId(long kitId) {
        this.kitId = kitId;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }
}
