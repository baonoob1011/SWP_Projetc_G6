package swp.project.adn_backend.controller.feedback;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.feedback.FeedbackRequest;
import swp.project.adn_backend.dto.response.feedback.FeedbackResponse;
import swp.project.adn_backend.dto.response.feedback.FeedbackStatisticsResponse;
import swp.project.adn_backend.entity.Feedback;
import swp.project.adn_backend.service.feedback.FeedbackService;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/create-feedback")
    public ResponseEntity<FeedbackResponse> createKit(@RequestBody @Valid FeedbackRequest feedbackRequest,
                                                      Authentication authentication,
                                                      @RequestParam long serviceId) {
        return ResponseEntity.ok(feedbackService.createFeedback(authentication,
                feedbackRequest,
                serviceId));
    }

    @PostMapping("/response-feedback")
    public ResponseEntity<String> feedbackResponse(@RequestBody FeedbackRequest feedbackRequest,
                                                   @RequestParam long feedbackId) {
        feedbackService.feedbackResponse(feedbackRequest,
                feedbackId);
        return ResponseEntity.ok("Response successful");
    }

    @GetMapping("/get-all-feedback-of-service")
    public ResponseEntity<FeedbackStatisticsResponse> getFeedbackOfService(@RequestParam long serviceId) {
        return ResponseEntity.ok(feedbackService.getFeedbackOfService(serviceId));
    }

    @PutMapping("/update-feedback/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable("id") Long feedbackId,
                                                   @RequestBody @Valid FeedbackRequest feedbackRequest,
                                                   Authentication authentication) {
        return ResponseEntity.ok(feedbackService.updateFeedback(feedbackId, feedbackRequest, authentication));
    }

    @DeleteMapping("/delete-feedback/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable("id") Long feedbackId,
                                               Authentication authentication) {
        feedbackService.deleteFeedback(feedbackId, authentication);
        return ResponseEntity.noContent().build();
    }
}
