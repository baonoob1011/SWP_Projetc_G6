package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    long locationId;
    @Column(name = "address_line", columnDefinition = "nvarchar(255)")
    String addressLine;
    @Column( columnDefinition = "nvarchar(255)")
    String district;
    @Column(columnDefinition = "nvarchar(255)")
    String city;

    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Appointment> appointment;

    @OneToMany(mappedBy = "location", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Room> rooms;


    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }

    public Location() {
    }

    public List<Appointment> getAppointment() {
        return appointment;
    }

    public void setAppointment(List<Appointment> appointment) {
        this.appointment = appointment;
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
