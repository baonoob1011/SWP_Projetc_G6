package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.AppointmentStatus;
import swp.project.adn_backend.enums.AppointmentType;

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

    @Enumerated(EnumType.STRING)
    AppointmentType appointmentType;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "user_id")
    Users users;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "staff_id")
    Staff staff;

    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Invoice> invoices;

    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Patient> patients;

    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Result> results;

    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Sample> sampleList;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "slot_id")
    Slot slot;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "service_id")
    ServiceTest services;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "location_id")
    Location location;

    @OneToOne(mappedBy = "appointment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    KitDeliveryStatus kitDeliveryStatus;

    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<Payment> payments;

    @OneToMany(mappedBy = "appointment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<ResultLocus> resultLoci;

    public Appointment(long appointmentId, LocalDate appointmentDate, AppointmentStatus appointmentStatus, String note, AppointmentType appointmentType, Users users, Staff staff, List<Invoice> invoices, List<Patient> patients, List<Result> results, List<Sample> sampleList, Slot slot, ServiceTest services, Location location, KitDeliveryStatus kitDeliveryStatus, List<Payment> payments, List<ResultLocus> resultLoci) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.appointmentStatus = appointmentStatus;
        this.note = note;
        this.appointmentType = appointmentType;
        this.users = users;
        this.staff = staff;
        this.invoices = invoices;
        this.patients = patients;
        this.results = results;
        this.sampleList = sampleList;
        this.slot = slot;
        this.services = services;
        this.location = location;
        this.kitDeliveryStatus = kitDeliveryStatus;
        this.payments = payments;
        this.resultLoci = resultLoci;
    }

    public List<Sample> getSampleList() {
        return sampleList;
    }

    public void setSampleList(List<Sample> sampleList) {
        this.sampleList = sampleList;
    }

    public List<ResultLocus> getResultLoci() {
        return resultLoci;
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }

    public void setResultLoci(List<ResultLocus> resultLoci) {
        this.resultLoci = resultLoci;
    }

    public Appointment() {
    }

    public KitDeliveryStatus getKitDeliveryStatus() {
        return kitDeliveryStatus;
    }

    public void setKitDeliveryStatus(KitDeliveryStatus kitDeliveryStatus) {
        this.kitDeliveryStatus = kitDeliveryStatus;
    }

    public List<Invoice> getInvoices() {
        return invoices;
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public void setPatients(List<Patient> patients) {
        this.patients = patients;
    }

    public AppointmentType getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(AppointmentType appointmentType) {
        this.appointmentType = appointmentType;
    }

    public void setInvoices(List<Invoice> invoices) {
        this.invoices = invoices;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
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
