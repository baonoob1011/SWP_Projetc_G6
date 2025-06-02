package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.FeedbackRequest;
import swp.project.adn_backend.dto.request.PriceListRequest;
import swp.project.adn_backend.entity.Feedback;
import swp.project.adn_backend.entity.PriceList;


@Mapper(componentModel = "spring")
public interface FeedbackMapper {
    Feedback toFeedback(FeedbackRequest feedbackRequest);
}