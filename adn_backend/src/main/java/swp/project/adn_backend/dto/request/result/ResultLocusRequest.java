package swp.project.adn_backend.dto.request.result;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.entity.Result;

public class ResultLocusRequest {
    String locusName;
    double allele1;
    double allele2;
    double frequency;
    double pi;
    private Long locusId;
    private String sampleCode1;
    private String sampleCode2;

    public Long getLocusId() {
        return locusId;
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

    public void setLocusId(Long locusId) {
        this.locusId = locusId;
    }

    public String getLocusName() {
        return locusName;
    }

    public void setLocusName(String locusName) {
        this.locusName = locusName;
    }

    public double getAllele1() {
        return allele1;
    }

    public void setAllele1(double allele1) {
        this.allele1 = allele1;
    }

    public double getAllele2() {
        return allele2;
    }

    public void setAllele2(double allele2) {
        this.allele2 = allele2;
    }

    public double getFrequency() {
        return frequency;
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
}
