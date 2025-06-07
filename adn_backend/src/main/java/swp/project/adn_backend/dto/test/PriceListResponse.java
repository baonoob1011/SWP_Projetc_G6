package swp.project.adn_backend.dto.test;

public class PriceListResponse {
    private String time;
    private double price;

    public PriceListResponse(String time, double price) {
        this.time = time;
        this.price = price;
    }

    public PriceListResponse() {
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