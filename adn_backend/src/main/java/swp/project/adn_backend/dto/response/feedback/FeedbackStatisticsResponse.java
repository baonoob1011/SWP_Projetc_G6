package swp.project.adn_backend.dto.response.feedback;

import swp.project.adn_backend.enums.Rating;

import java.util.List;
import java.util.Map;

public class FeedbackStatisticsResponse {
    private double averageRating;
    private Map<Rating, Double> ratingPercentage;
    private List<AllFeedbackResponse> allFeedbackResponses;

    // Getters and setters

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public Map<Rating, Double> getRatingPercentage() {
        return ratingPercentage;
    }

    public void setRatingPercentage(Map<Rating, Double> ratingPercentage) {
        this.ratingPercentage = ratingPercentage;
    }

    public List<AllFeedbackResponse> getAllFeedbackResponses() {
        return allFeedbackResponses;
    }

    public void setAllFeedbackResponses(List<AllFeedbackResponse> allFeedbackResponses) {
        this.allFeedbackResponses = allFeedbackResponses;
    }
}

