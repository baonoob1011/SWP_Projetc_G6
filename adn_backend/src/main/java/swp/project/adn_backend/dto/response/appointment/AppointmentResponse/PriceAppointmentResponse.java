package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import lombok.NoArgsConstructor;


public class PriceAppointmentResponse {
    private double price;
    private String time;

    public PriceAppointmentResponse(double price, String time) {
        this.price = price;
        this.time = time;
    }

    public PriceAppointmentResponse() {
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
