package swp.project.adn_backend.dto.request.serviceRequest;

import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.Rating;

import java.time.LocalDate;

public class FeedbackRequest {

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



}
