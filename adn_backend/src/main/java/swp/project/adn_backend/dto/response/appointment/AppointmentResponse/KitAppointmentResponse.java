package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import swp.project.adn_backend.enums.DeliveryStatus;

import java.time.LocalDate;

public class KitAppointmentResponse {
    String kitCode;
    String kitName;
    String targetPersonCount;
    String contents;
    DeliveryStatus kitStatus;
    LocalDate deliveryDate;
    LocalDate returnDate;
    int quantity;

    public KitAppointmentResponse() {
    }

    public KitAppointmentResponse(String kitCode, String kitName, String targetPersonCount, String contents, DeliveryStatus kitStatus, LocalDate deliveryDate, LocalDate returnDate, int quantity) {
        this.kitCode = kitCode;
        this.kitName = kitName;
        this.targetPersonCount = targetPersonCount;
        this.contents = contents;
        this.kitStatus = kitStatus;
        this.deliveryDate = deliveryDate;
        this.returnDate = returnDate;
        this.quantity = quantity;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
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

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }
}
