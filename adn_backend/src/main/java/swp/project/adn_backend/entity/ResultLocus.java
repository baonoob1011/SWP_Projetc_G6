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
    String sampleCode;
    @Column(name = "locus_name")
    String locusName;

    @Column(name = "allele_1")
    double allele1;

    @Column(name = "allele_2")
    double allele2;

    double frequency;
    double pi;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "sample_id")
    Sample sample;

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
    List<ResultAllele>resultAlleles;
    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "locus_id")
    private Locus locus;
    public List<ResultAllele> getResultAlleles() {
        return resultAlleles;
    }

    public void setResultAlleles(List<ResultAllele> resultAlleles) {
        this.resultAlleles = resultAlleles;
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

    public String getSampleCode() {
        return sampleCode;
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

    public void setSampleCode(String sampleCode) {
        this.sampleCode = sampleCode;
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


    public Sample getSample() {
        return sample;
    }

    public void setSample(Sample sample) {
        this.sample = sample;
    }
}
