package swp.project.adn_backend.dto.response.serviceResponse;

public class PriceListResponse {
    private long priceId;
    private String time;
    private double price;

    public PriceListResponse() {
    }

    public PriceListResponse(long priceId, String time, double price) {
        this.priceId = priceId;
        this.time = time;
        this.price = price;
    }

    public long getPriceId() {
        return priceId;
    }

    public void setPriceId(long priceId) {
        this.priceId = priceId;
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
    // constructors, getters, setters
}