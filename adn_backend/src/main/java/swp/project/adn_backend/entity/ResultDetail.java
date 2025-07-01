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

@Table(name = "ResultDetail")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_detail_id")
    long resultDetailId;

    @Column(name = "combined_paternity_index")
    double combinedPaternityIndex;
    double paternityProbability;
    @Column(columnDefinition = "nvarchar(255)")
    String conclusion;

    @Column(name = "result_summary", columnDefinition = "nvarchar(255)")
    String resultSummary;
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    @OneToOne
    @JoinColumn(name = "result_id", nullable = false)
    Result result;

    @OneToMany(mappedBy = "resultDetail", fetch = FetchType.EAGER, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    List<ResultLocus> resultLoci;

    @OneToOne
    @JoinColumn(name = "sample_id", referencedColumnName = "sample_id")
    private Sample sample;

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public Sample getSample() {
        return sample;
    }

    public void setSample(Sample sample) {
        this.sample = sample;
    }

    public ResultDetail() {
    }

    public List<ResultLocus> getResultLoci() {
        return resultLoci;
    }

    public double getPaternityProbability() {
        return paternityProbability;
    }

    public void setPaternityProbability(double paternityProbability) {
        this.paternityProbability = paternityProbability;
    }

    public void setResultLoci(List<ResultLocus> resultLoci) {
        this.resultLoci = resultLoci;
    }

    public long getResultDetailId() {
        return resultDetailId;
    }

    public void setResultDetailId(long resultDetailId) {
        this.resultDetailId = resultDetailId;
    }

    public double getCombinedPaternityIndex() {
        return combinedPaternityIndex;
    }

    public void setCombinedPaternityIndex(double combinedPaternityIndex) {
        this.combinedPaternityIndex = combinedPaternityIndex;
    }

    public String getConclusion() {
        return conclusion;
    }

    public void setConclusion(String conclusion) {
        this.conclusion = conclusion;
    }

    public String getResultSummary() {
        return resultSummary;
    }

    public void setResultSummary(String resultSummary) {
        this.resultSummary = resultSummary;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }
}
