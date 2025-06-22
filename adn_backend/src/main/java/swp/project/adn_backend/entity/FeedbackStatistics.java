package swp.project.adn_backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "feedback_statistics")
public class FeedbackStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackStatisticsId;

    @OneToOne
    @JoinColumn(name = "service_id", referencedColumnName = "service_id")
    private ServiceTest service;

    @Column(name = "average_rating")
    private double averageRating;

    @Column(name = "one_star_percent")
    private double oneStarPercent;

    @Column(name = "two_star_percent")
    private double twoStarPercent;

    @Column(name = "three_star_percent")
    private double threeStarPercent;

    @Column(name = "four_star_percent")
    private double fourStarPercent;

    @Column(name = "five_star_percent")
    private double fiveStarPercent;
    private LocalDate updatedAt;

    @OneToMany(mappedBy = "feedbackStatistics", fetch = FetchType.EAGER, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH,
    })
    List<Feedback> feedbacks;
    public FeedbackStatistics() {
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public List<Feedback> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<Feedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }
    // Getters, setters, constructor


    public Long getFeedbackStatisticsId() {
        return feedbackStatisticsId;
    }

    public void setFeedbackStatisticsId(Long feedbackStatisticsId) {
        this.feedbackStatisticsId = feedbackStatisticsId;
    }

    public ServiceTest getService() {
        return service;
    }

    public void setService(ServiceTest service) {
        this.service = service;
    }

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
}
