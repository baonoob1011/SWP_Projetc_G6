package swp.project.adn_backend.dto.response.feedback;

import swp.project.adn_backend.enums.Rating;

import java.time.LocalDate;

public class FeedbackResponse {
    private long feedbackId;
    private String feedbackText;
    private LocalDate dateSubmitted;
    private Rating rating;
    private String feedbackResponse;

    public String getFeedbackResponse() {
        return feedbackResponse;
    }

    public void setFeedbackResponse(String feedbackResponse) {
        this.feedbackResponse = feedbackResponse;
    }

    public Rating getRating() {
        return rating;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    public long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(long feedbackId) {
        this.feedbackId = feedbackId;
    }

    public LocalDate getDateSubmitted() {
        return dateSubmitted;
    }

    public void setDateSubmitted(LocalDate dateSubmitted) {
        this.dateSubmitted = dateSubmitted;
    }

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }
}
