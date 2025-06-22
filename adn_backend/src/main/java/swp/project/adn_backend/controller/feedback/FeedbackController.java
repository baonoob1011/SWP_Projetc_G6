package swp.project.adn_backend.controller.feedback;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.InfoDTO.KitInfoDTO;
import swp.project.adn_backend.dto.request.Kit.KitRequest;
import swp.project.adn_backend.dto.request.serviceRequest.FeedbackRequest;
import swp.project.adn_backend.dto.response.feedback.AllFeedbackResponse;
import swp.project.adn_backend.dto.response.feedback.FeedbackResponse;
import swp.project.adn_backend.dto.response.feedback.FeedbackStatisticsResponse;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.service.Kit.KitService;
import swp.project.adn_backend.service.feedback.FeedbackService;

import java.util.List;

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

    @GetMapping("/get-all-feedback-of-service")
    public ResponseEntity<FeedbackStatisticsResponse> getFeedbackOfService(@RequestParam long serviceId) {
        return ResponseEntity.ok(feedbackService.getFeedbackOfService(serviceId));
    }
    // thuc lam update , xoa
}
