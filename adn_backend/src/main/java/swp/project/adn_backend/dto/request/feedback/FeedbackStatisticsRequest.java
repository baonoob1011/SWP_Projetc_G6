package swp.project.adn_backend.dto.request.feedback;

import java.time.LocalDate;

public class FeedbackStatisticsRequest {

    private double averageRating;

    private double oneStarPercent;
    private double twoStarPercent;
    private double threeStarPercent;
    private double fourStarPercent;
    private double fiveStarPercent;

    private LocalDate updatedAt;

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public double getOneStarPercent() {
        return oneStarPercent;
    }

    public void setOneStarPercent(double oneStarPercent) {
        this.oneStarPercent = oneStarPercent;
    }

    public double getTwoStarPercent() {
        return twoStarPercent;
    }

    public void setTwoStarPercent(double twoStarPercent) {
        this.twoStarPercent = twoStarPercent;
    }

    public double getThreeStarPercent() {
        return threeStarPercent;
    }

    public void setThreeStarPercent(double threeStarPercent) {
        this.threeStarPercent = threeStarPercent;
    }

    public double getFourStarPercent() {
        return fourStarPercent;
    }

    public void setFourStarPercent(double fourStarPercent) {
        this.fourStarPercent = fourStarPercent;
    }

    public double getFiveStarPercent() {
        return fiveStarPercent;
    }

    public void setFiveStarPercent(double fiveStarPercent) {
        this.fiveStarPercent = fiveStarPercent;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }
}
