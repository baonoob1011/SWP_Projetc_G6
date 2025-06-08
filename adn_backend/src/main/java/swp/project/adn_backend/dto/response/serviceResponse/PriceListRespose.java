package swp.project.adn_backend.dto.response.serviceResponse;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.entity.ServiceTest;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class PriceListRespose {

    LocalDate effectiveDate;
    String time;
    ServiceTest service;
    double price;

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public ServiceTest getService() {
        return service;
    }

    public void setService(ServiceTest service) {
        this.service = service;
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
