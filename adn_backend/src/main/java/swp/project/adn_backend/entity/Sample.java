package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.SampleStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Sample")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Sample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sample_id")
    long sampleId;

    String sampleCode;
    @Column(name = "sample_type", columnDefinition = "nvarchar(255)")
    String sampleType;

    @Column(name = "collection_date")
    LocalDate collectionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "sample_status")
    SampleStatus sampleStatus;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "appointment_id", nullable = false)
    Appointment appointment;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "patient_id", nullable = false)
    Patient patient;


    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "kit_id", nullable = false)
    Kit kit;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "staff_id", nullable = false)
    Staff staff;


    @OneToMany(mappedBy = "sample", fetch = FetchType.EAGER, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    List<ResultAllele> resultAlleles;

    @OneToOne(mappedBy = "sample", cascade = CascadeType.ALL)
    private ResultDetail resultDetail;

    public Sample() {
    }

    public Sample(long sampleId, String sampleCode, String sampleType, LocalDate collectionDate, SampleStatus sampleStatus, Appointment appointment, Patient patient, Kit kit, Staff staff, List<ResultAllele> resultAlleles, ResultDetail resultDetail) {
        this.sampleId = sampleId;
        this.sampleCode = sampleCode;
        this.sampleType = sampleType;
        this.collectionDate = collectionDate;
        this.sampleStatus = sampleStatus;
        this.appointment = appointment;
        this.patient = patient;
        this.kit = kit;
        this.staff = staff;
        this.resultAlleles = resultAlleles;
        this.resultDetail = resultDetail;
    }

    public List<ResultAllele> getResultAlleles() {
        return resultAlleles;
    }

    public void setResultAlleles(List<ResultAllele> resultAlleles) {
        this.resultAlleles = resultAlleles;
    }

    public ResultDetail getResultDetail() {
        return resultDetail;
    }

    public void setResultDetail(ResultDetail resultDetail) {
        this.resultDetail = resultDetail;
    }

    public String getSampleCode() {
        return sampleCode;
    }

    public void setSampleCode(String sampleCode) {
        this.sampleCode = sampleCode;
    }


    public long getSampleId() {
        return sampleId;
    }

    public void setSampleId(long sampleId) {
        this.sampleId = sampleId;
    }

    public String getSampleType() {
        return sampleType;
    }

    public void setSampleType(String sampleType) {
        this.sampleType = sampleType;
    }

    public LocalDate getCollectionDate() {
        return collectionDate;
    }

    public void setCollectionDate(LocalDate collectionDate) {
        this.collectionDate = collectionDate;
    }

    public SampleStatus getSampleStatus() {
        return sampleStatus;
    }

    public void setSampleStatus(SampleStatus sampleStatus) {
        this.sampleStatus = sampleStatus;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Kit getKit() {
        return kit;
    }

    public void setKit(Kit kit) {
        this.kit = kit;
    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }


}
