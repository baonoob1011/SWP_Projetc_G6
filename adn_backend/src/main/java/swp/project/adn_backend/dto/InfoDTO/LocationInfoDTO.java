package swp.project.adn_backend.dto.InfoDTO;

public class LocationInfoDTO {
    long locationId;
    String addressLine;
    String district;
    String city;
    long roomId;

    public LocationInfoDTO(long locationId, String addressLine, String district, String city, long roomId) {
        this.locationId = locationId;
        this.addressLine = addressLine;
        this.district = district;
        this.city = city;
        this.roomId = roomId;
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

    public long getRoomId() {
        return roomId;
    }

    public void setRoomId(long roomId) {
        this.roomId = roomId;
    }
}
