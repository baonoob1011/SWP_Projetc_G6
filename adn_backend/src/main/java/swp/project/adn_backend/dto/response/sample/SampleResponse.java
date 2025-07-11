package swp.project.adn_backend.dto.response.sample;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.SampleStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SampleResponse {
    long sampleId;
    String sampleType;
    LocalDate collectionDate;
    SampleStatus sampleStatus;
    String sampleCode;

    public SampleResponse(long sampleId, String sampleType, LocalDate collectionDate, SampleStatus sampleStatus, String sampleCode) {
        this.sampleId = sampleId;
        this.sampleType = sampleType;
        this.collectionDate = collectionDate;
        this.sampleStatus = sampleStatus;
        this.sampleCode = sampleCode;
    }

    public SampleResponse() {

    }

    public long getSampleId() {
        return sampleId;
    }

    public void setSampleId(long sampleId) {
        this.sampleId = sampleId;
    }

    public String getSampleCode() {
        return sampleCode;
    }

    public void setSampleCode(String sampleCode) {
        this.sampleCode = sampleCode;
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
}
