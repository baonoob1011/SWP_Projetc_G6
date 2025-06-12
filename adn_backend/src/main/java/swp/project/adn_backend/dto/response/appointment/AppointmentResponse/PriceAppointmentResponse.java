package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import lombok.NoArgsConstructor;


public class PriceAppointmentResponse {
    private long priceId;
    private double price;
    private String time;


    public PriceAppointmentResponse(long priceId, double price, String time) {
        this.priceId = priceId;
        this.price = price;
        this.time = time;
    }

    public PriceAppointmentResponse() {
    }

    public long getPriceId() {
        return priceId;
    }

    public void setPriceId(long priceId) {
        this.priceId = priceId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
