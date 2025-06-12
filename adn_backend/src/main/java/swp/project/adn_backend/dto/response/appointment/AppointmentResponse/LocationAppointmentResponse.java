package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

public class LocationAppointmentResponse {
    private long locationId;
    private String addressLine;
    private String district;
    private String city;

    public LocationAppointmentResponse() {
    }

    public LocationAppointmentResponse(long locationId, String addressLine, String district, String city) {
        this.locationId = locationId;
        this.addressLine = addressLine;
        this.district = district;
        this.city = city;
    }

    public long getLocationId() {
        return locationId;
    }

    public void setLocationId(long locationId) {
        this.locationId = locationId;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
