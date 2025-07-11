package swp.project.adn_backend.dto.request.Location;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationRequest {
    long locationId;
    @NotBlank(message = "Address line must not be blank")
    String addressLine;
    @NotBlank(message = "Address line must not be blank")
    String district;
    @NotBlank(message = "Address line must not be blank")
    String city;

    public LocationRequest(long locationId, String addressLine, String district, String city) {
        this.locationId = locationId;
        this.addressLine = addressLine;
        this.district = district;
        this.city = city;
    }

    public LocationRequest() {

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
