package swp.project.adn_backend.dto.InfoDTO;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class KitStatusInfoDTO {
    long kitId;
    String kitCode;
    String kitName;
    String targetPersonCount;
    double price;
    String contents;
    DeliveryStatus kitStatus;
    LocalDate deliveryDate;
    LocalDate returnDate;


    public KitStatusInfoDTO(long kitId, String kitCode, String kitName, DeliveryStatus kitStatus, LocalDate returnDate, LocalDate deliveryDate) {
        this.kitId = kitId;
        this.kitCode = kitCode;
        this.kitName = kitName;
        this.kitStatus = kitStatus;
        this.returnDate = returnDate;
        this.deliveryDate = deliveryDate;
    }

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
