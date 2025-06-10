package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.AppointmentStatus;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Appointment")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    long appointmentId;

    @Column(name = "appointment_date")
    LocalDate appointmentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_status")
    AppointmentStatus appointmentStatus;
    @Column(columnDefinition = "nvarchar(255)")
    String note;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    @JoinColumn(name = "user_id", nullable = false)
    Users users;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    @JoinColumn(name = "staff_id", nullable = false)
    Staff staff;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    @JoinColumn(name = "slot_id", nullable = false)
    Slot slot;

    @OneToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "service_id")
    ServiceTest services;

    //    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY, cascade = {
//            CascadeType.PERSIST, CascadeType.MERGE,
//            CascadeType.DETACH, CascadeType.REFRESH
//    })
//    List<Patient> patients;
    @OneToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "location_id")
    Location location;

    public Appointment() {
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Slot getSlot() {
        return slot;
    }

    public void setSlot(Slot slot) {
        this.slot = slot;
    }

    public long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(long appointmentId) {
        this.appointmentId = appointmentId;
    }


    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }


    public AppointmentStatus getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(AppointmentStatus appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }


    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public ServiceTest getServices() {
        return services;
    }

    public void setServices(ServiceTest services) {
        this.services = services;
    }

//    public List<Patient> getPatients() {
//        return patients;
//    }
//
//    public void setPatients(List<Patient> patients) {
//        this.patients = patients;
//    }
}
