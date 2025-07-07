package swp.project.adn_backend.dto.response.result;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import swp.project.adn_backend.enums.SampleStatus;

import java.time.LocalDate;

public class SampleAlleleResponse {
    long sampleId;
    String sampleCode;
    String sampleType;
    SampleStatus sampleStatus;

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

    public SampleStatus getSampleStatus() {
        return sampleStatus;
    }

    public void setSampleStatus(SampleStatus sampleStatus) {
        this.sampleStatus = sampleStatus;
    }
}
