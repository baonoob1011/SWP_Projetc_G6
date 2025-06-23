package swp.project.adn_backend.dto.request.result;

import swp.project.adn_backend.enums.AlleleStatus;

public class AllelePairRequest {
    private double allele1;
    private double allele2;
    private AlleleStatus alleleStatus;

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

    public AlleleStatus getAlleleStatus() {
        return alleleStatus;
    }

    public void setAlleleStatus(AlleleStatus alleleStatus) {
        this.alleleStatus = alleleStatus;
    }

    // optional
}
