package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ResultLocus")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultLocus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_locus_id")
    long resultLocusId;
    private String sampleCode1;
    private String sampleCode2;
    @Column(name = "locus_name")
    String locusName;

    @Column(name = "allele_1")
    double allele1;

    @Column(name = "allele_2")
    double allele2;
    @Column(name = "father_allele_1")
    private Double fatherAllele1;

    @Column(name = "father_allele_2")
    private Double fatherAllele2;

    double frequency;
    double pi;


    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "result_detail_id")
    ResultDetail resultDetail;
    @OneToMany(mappedBy = "resultLocus", fetch = FetchType.EAGER, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    List<ResultAllele> resultAlleles;
    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "locus_id")
    private Locus locus;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    @JoinColumn(name = "appointment_id")
    Appointment appointment;

    public Double getFatherAllele1() {
        return fatherAllele1;
    }

    public void setFatherAllele1(Double fatherAllele1) {
        this.fatherAllele1 = fatherAllele1;
    }

    public Double getFatherAllele2() {
        return fatherAllele2;
    }

    public void setFatherAllele2(Double fatherAllele2) {
        this.fatherAllele2 = fatherAllele2;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public List<ResultAllele> getResultAlleles() {
        return resultAlleles;
    }

    public void setResultAlleles(List<ResultAllele> resultAlleles) {
        this.resultAlleles = resultAlleles;
    }

    public String getSampleCode1() {
        return sampleCode1;
    }

    public void setSampleCode1(String sampleCode1) {
        this.sampleCode1 = sampleCode1;
    }

    public String getSampleCode2() {
        return sampleCode2;
    }

    public void setSampleCode2(String sampleCode2) {
        this.sampleCode2 = sampleCode2;
    }

    public Locus getLocus() {
        return locus;
    }

    public void setLocus(Locus locus) {
        this.locus = locus;
    }

    public void setAllele1(double allele1) {
        this.allele1 = allele1;
    }

    public void setAllele2(double allele2) {
        this.allele2 = allele2;
    }

    public ResultDetail getResultDetail() {
        return resultDetail;
    }

    public void setResultDetail(ResultDetail resultDetail) {
        this.resultDetail = resultDetail;
    }


    public void setLocusName(String locusName) {
        this.locusName = locusName;
    }

    public Double getAllele1() {
        return allele1;
    }

    public void setAllele1(Double allele1) {
        this.allele1 = allele1;
    }

    public Double getAllele2() {
        return allele2;
    }

    public void setAllele2(Double allele2) {
        this.allele2 = allele2;
    }

    public void setFrequency(double frequency) {
        this.frequency = frequency;
    }

    public double getPi() {
        return pi;
    }

    public void setPi(double pi) {
        this.pi = pi;
    }


    public long getResultLocusId() {
        return resultLocusId;
    }

    public void setResultLocusId(long resultLocusId) {
        this.resultLocusId = resultLocusId;
    }

    public String getLocusName() {
        return locusName;
    }


    public double getFrequency() {
        return frequency;
    }


}
