package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import swp.project.adn_backend.enums.AlleleStatus;

@Entity
@Table(name = "result_allele")
public class ResultAllele {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long alleleId;
    private double alleleValue;
    private String allelePosition;
    @Enumerated(EnumType.STRING)
    private AlleleStatus alleleStatus;
    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    @JoinColumn(name = "result_locus_id")
    private ResultLocus resultLocus;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    @JoinColumn(name = "sample_id")
    private Sample sample;

    @ManyToOne
    @JoinColumn(name = "locus_id")
    private Locus locus;

    public Locus getLocus() {
        return locus;
    }

    public void setLocus(Locus locus) {
        this.locus = locus;
    }

    public Sample getSample() {
        return sample;
    }

    public AlleleStatus getAlleleStatus() {
        return alleleStatus;
    }

    public void setAlleleStatus(AlleleStatus alleleStatus) {
        this.alleleStatus = alleleStatus;
    }

    public void setSample(Sample sample) {
        this.sample = sample;
    }

    public long getAlleleId() {
        return alleleId;
    }

    public void setAlleleId(long alleleId) {
        this.alleleId = alleleId;
    }

    public double getAlleleValue() {
        return alleleValue;
    }

    public void setAlleleValue(double alleleValue) {
        this.alleleValue = alleleValue;
    }

    public String getAllelePosition() {
        return allelePosition;
    }

    public void setAllelePosition(String allelePosition) {
        this.allelePosition = allelePosition;
    }

    public ResultLocus getResultLocus() {
        return resultLocus;
    }

    public void setResultLocus(ResultLocus resultLocus) {
        this.resultLocus = resultLocus;
    }
}
