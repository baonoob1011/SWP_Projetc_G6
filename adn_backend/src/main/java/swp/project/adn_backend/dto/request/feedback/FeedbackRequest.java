package swp.project.adn_backend.dto.request.feedback;

import swp.project.adn_backend.enums.Rating;

public class FeedbackRequest {
    String feedbackResponse;

    String feedbackText;

    private Rating rating;

    public Rating getRating() {
        return rating;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }

    public String getFeedbackResponse() {
        return feedbackResponse;
    }

    public void setFeedbackResponse(String feedbackResponse) {
        this.feedbackResponse = feedbackResponse;
    }
}
