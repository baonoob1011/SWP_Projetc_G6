package swp.project.adn_backend.dto.response.appointment.AppointmentResponse.appointmentResult;

import jakarta.persistence.Column;

public class ResultLocusAppointmentResponse {
    long resultLocusId;
    private String sampleCode1;
    private String sampleCode2;
    String locusName;
    private Double fatherAllele1;

    private Double fatherAllele2;
    double allele1;
    double allele2;
    double frequency;
    double pi;

    public long getResultLocusId() {
        return resultLocusId;
    }

    public void setResultLocusId(long resultLocusId) {
        this.resultLocusId = resultLocusId;
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
}
