package swp.project.adn_backend.dto.response.result;

public class ResultLocusResponse {
    String locusName;
    double allele1;
    double allele2;
    double frequency;
    double pi;

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
