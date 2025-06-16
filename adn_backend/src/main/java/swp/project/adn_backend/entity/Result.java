package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.ResultStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity

@Table(name = "Result")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    long result_id;

    @Column(name = "collection_date")
    LocalDate collectionDate;

    @Column(name = "result_date")
    LocalDate resultDate;

    @Column(name = "result_status")
    ResultStatus resultStatus;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "sample_id", nullable = false)
    Sample sample;

    @OneToMany(mappedBy = "result", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<ResultLocus> resultLocus;

    @OneToOne(mappedBy = "result")
    ResultDetail resultDetail;

    public Result() {
    }

    public Result(long result_id, LocalDate collectionDate, LocalDate resultDate, ResultStatus resultStatus, Sample sample, List<ResultLocus> resultLocus, ResultDetail resultDetail) {
        this.result_id = result_id;
        this.collectionDate = collectionDate;
        this.resultDate = resultDate;
        this.resultStatus = resultStatus;
        this.sample = sample;
        this.resultLocus = resultLocus;
        this.resultDetail = resultDetail;
    }

    public long getResult_id() {
        return result_id;
    }

    public void setResult_id(long result_id) {
        this.result_id = result_id;
    }

    public LocalDate getCollectionDate() {
        return collectionDate;
    }

    public void setCollectionDate(LocalDate collectionDate) {
        this.collectionDate = collectionDate;
    }

    public LocalDate getResultDate() {
        return resultDate;
    }

    public void setResultDate(LocalDate resultDate) {
        this.resultDate = resultDate;
    }

    public ResultStatus getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(ResultStatus resultStatus) {
        this.resultStatus = resultStatus;
    }

    public Sample getSample() {
        return sample;
    }

    public void setSample(Sample sample) {
        this.sample = sample;
    }

    public List<ResultLocus> getResultLocus() {
        return resultLocus;
    }

    public void setResultLocus(List<ResultLocus> resultLocus) {
        this.resultLocus = resultLocus;
    }

    public ResultDetail getResultDetail() {
        return resultDetail;
    }

    public void setResultDetail(ResultDetail resultDetail) {
        this.resultDetail = resultDetail;
    }
}
