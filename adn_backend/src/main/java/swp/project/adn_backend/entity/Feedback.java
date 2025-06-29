package swp.project.adn_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.Rating;

import java.time.LocalDate;

@Entity
@Table(name = "Feedback")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Feedback {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    long feedbackId;
    @Enumerated(EnumType.STRING) // lưu dưới dạng chuỗi: "ONE_STAR", "TWO_STAR", ...
    @Column(name = "rating", nullable = false)
    private Rating rating;
    String feedbackResponse;
    @Column(name = "feedback_text",columnDefinition = "nvarchar(255)")
    String feedbackText;

    @Column(name = "date_submitted")
    LocalDate dateSubmitted;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "user_id", nullable = false)
    Users users;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "service_id", nullable = false)
    ServiceTest service;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "feedback_statistics_id")
    FeedbackStatistics feedbackStatistics;

    public FeedbackStatistics getFeedbackStatistics() {
        return feedbackStatistics;
    }

    public void setFeedbackStatistics(FeedbackStatistics feedbackStatistics) {
        this.feedbackStatistics = feedbackStatistics;
    }

    public Feedback() {
    }

    public Feedback(long feedbackId, String feedbackText, LocalDate dateSubmitted, Users users, ServiceTest service) {
        this.feedbackId = feedbackId;
        this.feedbackText = feedbackText;
        this.dateSubmitted = dateSubmitted;
        this.users = users;
        this.service = service;
    }

    public Rating getRating() {
        return rating;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    public String getFeedbackResponse() {
        return feedbackResponse;
    }

    public void setFeedbackResponse(String feedbackResponse) {
        this.feedbackResponse = feedbackResponse;
    }

    public long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(long feedbackId) {
        this.feedbackId = feedbackId;
    }

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }

    public LocalDate getDateSubmitted() {
        return dateSubmitted;
    }

    public void setDateSubmitted(LocalDate dateSubmitted) {
        this.dateSubmitted = dateSubmitted;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public ServiceTest getService() {
        return service;
    }

    public void setService(ServiceTest service) {
        this.service = service;
    }
}
