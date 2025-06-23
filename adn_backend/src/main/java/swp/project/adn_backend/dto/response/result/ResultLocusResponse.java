package swp.project.adn_backend.dto.response.result;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultLocusResponse {
    String locusName;
    double allele1;
    double allele2;
    double frequency;
    double pi;
    String sampleCode1;
    String sampleCode2;

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
