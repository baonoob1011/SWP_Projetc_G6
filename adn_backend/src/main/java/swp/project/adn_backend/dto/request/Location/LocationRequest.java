package swp.project.adn_backend.dto.request.Location;

import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationRequest {
    String addressLine;
    String district;
    String city;

    public LocationRequest(String addressLine, String district, String city) {
        this.addressLine = addressLine;
        this.district = district;
        this.city = city;
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
