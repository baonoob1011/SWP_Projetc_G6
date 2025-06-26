package swp.project.adn_backend.dto.response.discount;

import java.time.LocalDate;

public class DiscountResponse {
    long discountId;
    String discountName;
    double discountValue;
    LocalDate startDate;
    LocalDate endDate;
    boolean isActive ;

    public DiscountResponse(long discountId, String discountName, double discountValue, LocalDate startDate, LocalDate endDate, boolean isActive) {
        this.discountId = discountId;
        this.discountName = discountName;
        this.discountValue = discountValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
    }

    public DiscountResponse() {
    }

    public long getDiscountId() {
        return discountId;
    }

    public void setDiscountId(long discountId) {
        this.discountId = discountId;
    }

    public String getDiscountName() {
        return discountName;
    }

    public void setDiscountName(String discountName) {
        this.discountName = discountName;
    }

    public double getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(double discountValue) {
        this.discountValue = discountValue;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
