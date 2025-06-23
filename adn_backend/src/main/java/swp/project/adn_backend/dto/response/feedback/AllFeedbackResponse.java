package swp.project.adn_backend.dto.response.feedback;

public class AllFeedbackResponse {
    private UserFeedbackResponse userFeedbackResponse;
    private ServiceFeedbackResponse serviceFeedbackResponse;
    private FeedbackResponse feedbackResponse;

    public AllFeedbackResponse() {
    }

    public UserFeedbackResponse getUserFeedbackResponse() {
        return userFeedbackResponse;
    }

    public void setUserFeedbackResponse(UserFeedbackResponse userFeedbackResponse) {
        this.userFeedbackResponse = userFeedbackResponse;
    }

    public ServiceFeedbackResponse getServiceFeedbackResponse() {
        return serviceFeedbackResponse;
    }

    public void setServiceFeedbackResponse(ServiceFeedbackResponse serviceFeedbackResponse) {
        this.serviceFeedbackResponse = serviceFeedbackResponse;
    }

    public FeedbackResponse getFeedbackResponse() {
        return feedbackResponse;
    }

    public void setFeedbackResponse(FeedbackResponse feedbackResponse) {
        this.feedbackResponse = feedbackResponse;
    }
}
