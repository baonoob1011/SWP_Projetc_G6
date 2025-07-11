package swp.project.adn_backend.dto.request.sample;

import jakarta.persistence.Column;
import swp.project.adn_backend.enums.SampleStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SampleRequest {
    String sampleType;
    LocalDate collectionDate;
    SampleStatus sampleStatus;
    String sampleCode;
    public SampleRequest(String sampleType, LocalDate collectionDate, SampleStatus sampleStatus) {
        this.sampleType = sampleType;
        this.collectionDate = collectionDate;
        this.sampleStatus = sampleStatus;
    }

    public SampleRequest() {

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
