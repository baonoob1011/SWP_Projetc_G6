package swp.project.adn_backend.dto.request.serviceRequest;

import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddPriceListRequest {
    LocalDate effectiveDate;
    String time;
    double price;

    public AddPriceListRequest(LocalDate effectiveDate, String time, double price) {
        this.effectiveDate = effectiveDate;
        this.time = time;
        this.price = price;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
