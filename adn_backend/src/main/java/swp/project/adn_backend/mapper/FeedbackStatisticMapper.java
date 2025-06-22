package swp.project.adn_backend.mapper;

import org.mapstruct.Mapper;
import swp.project.adn_backend.dto.request.feedback.FeedbackRequest;
import swp.project.adn_backend.dto.request.feedback.FeedbackStatisticsRequest;
import swp.project.adn_backend.dto.response.feedback.FeedbackResponse;
import swp.project.adn_backend.dto.response.feedback.ServiceFeedbackResponse;
import swp.project.adn_backend.dto.response.feedback.UserFeedbackResponse;
import swp.project.adn_backend.entity.Feedback;
import swp.project.adn_backend.entity.FeedbackStatistics;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.entity.Users;


@Mapper(componentModel = "spring")
public interface FeedbackStatisticMapper {
    FeedbackStatistics toFeedbackStatistics(FeedbackStatisticsRequest feedbackStatisticsRequest);
    FeedbackResponse toFeedbackResponse(Feedback feedback);


}