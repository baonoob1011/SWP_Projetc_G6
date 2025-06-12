package swp.project.adn_backend.dto.InfoDTO;

import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class KitInfoDTO {
    String kitCode;
    String kitName;
    String targetPersonCount;
    double price;
    String contents;
    DeliveryStatus kitStatus;
    LocalDate delivery_date;
    LocalDate return_date;
    public KitInfoDTO(String kitCode, String kitName, String targetPersonCount, double price, String contents) {
        this.kitCode = kitCode;
        this.kitName = kitName;
        this.targetPersonCount = targetPersonCount;
        this.price = price;
        this.contents = contents;
    }

    public KitInfoDTO(String kitCode, String kitName,  DeliveryStatus kitStatus, LocalDate delivery_date, LocalDate return_date) {
        this.kitCode = kitCode;
        this.kitName = kitName;
        this.kitStatus = kitStatus;
        this.delivery_date = delivery_date;
        this.return_date = return_date;
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
