package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.serviceRequest.FeedbackRequest;
import swp.project.adn_backend.entity.Feedback;


@Mapper(componentModel = "spring")
public interface FeedbackMapper {
    Feedback toFeedback(FeedbackRequest feedbackRequest);
}