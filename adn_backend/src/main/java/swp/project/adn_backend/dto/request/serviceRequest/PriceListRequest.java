package swp.project.adn_backend.dto.request.serviceRequest;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.entity.ServiceTest;

import java.time.LocalDate;
import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class PriceListRequest {
    private Long priceId;   // <-- trường quan trọng để update chính xác
    List<PriceListRequest> priceListRequests;
    LocalDate effectiveDate;
    String time;
    ServiceTest service;
    Double  price;



    public List<PriceListRequest> getPriceListRequests() {
        return priceListRequests;
    }

    public Long getPriceId() {
        return priceId;
    }

    public void setPriceId(Long priceId) {
        this.priceId = priceId;
    }

    public void setPriceListRequests(List<PriceListRequest> priceListRequests) {
        this.priceListRequests = priceListRequests;
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

    public ServiceTest getService() {
        return service;
    }

    public void setService(ServiceTest service) {
        this.service = service;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
