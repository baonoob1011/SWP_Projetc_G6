package swp.project.adn_backend.dto.response.serviceResponse;

public class PriceListResponse {
    private long priceId;
    private String time;
    private double price;
    private double priceTmp;

    public PriceListResponse() {
    }

    public PriceListResponse(long priceId, String time, double price) {
        this.priceId = priceId;
        this.time = time;
        this.price = price;
    }

    public double getPriceTmp() {
        return priceTmp;
    }

    public void setPriceTmp(double priceTmp) {
        this.priceTmp = priceTmp;
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