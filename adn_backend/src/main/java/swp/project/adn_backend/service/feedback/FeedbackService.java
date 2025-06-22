package swp.project.adn_backend.service.feedback;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.serviceRequest.FeedbackRequest;
import swp.project.adn_backend.dto.response.feedback.*;
import swp.project.adn_backend.entity.Feedback;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Rating;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.FeedbackMapper;
import swp.project.adn_backend.repository.FeedbackRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class FeedbackService {
    private FeedbackRepository feedbackRepository;
    private FeedbackMapper feedbackMapper;
    private UserRepository userRepository;
    private ServiceTestRepository serviceTestRepository;

    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository, FeedbackMapper feedbackMapper, UserRepository userRepository, ServiceTestRepository serviceTestRepository) {
        this.feedbackRepository = feedbackRepository;
        this.feedbackMapper = feedbackMapper;
        this.userRepository = userRepository;
        this.serviceTestRepository = serviceTestRepository;
    }

    public FeedbackResponse createFeedback(Authentication authentication,
                                           FeedbackRequest feedbackRequest,
                                           long serviceId) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Users userFeedback = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        Feedback feedback = feedbackMapper.toFeedback(feedbackRequest);
        feedback.setDateSubmitted(LocalDate.now());
        feedback.setUsers(userFeedback);
        feedback.setService(serviceTest);
        feedbackRepository.save(feedback);
        FeedbackResponse feedbackResponse = feedbackMapper.toFeedbackResponse(feedback);
        return feedbackResponse;
    }

    public FeedbackStatisticsResponse getFeedbackOfService(long serviceId) {
        List<AllFeedbackResponse> allFeedbackResponses = new ArrayList<>();
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        int totalRating = 0;
        int totalFeedback = serviceTest.getFeedbacks().size();

        Map<Rating, Integer> ratingCount = new EnumMap<>(Rating.class);
        for (Rating r : Rating.values()) {
            ratingCount.put(r, 0);
        }

        for (Feedback feedback : serviceTest.getFeedbacks()) {
            Rating rating = feedback.getRating();
            totalRating += rating.getValue();
            ratingCount.put(rating, ratingCount.get(rating) + 1);

            FeedbackResponse feedbackResponse = feedbackMapper.toFeedbackResponse(feedback);
            UserFeedbackResponse userFeedbackResponse = feedbackMapper.toUserFeedbackResponse(feedback.getUsers());
            ServiceFeedbackResponse serviceFeedbackResponse = feedbackMapper.toServiceFeedbackResponse(serviceTest);

            AllFeedbackResponse allFeedbackResponse = new AllFeedbackResponse();
            allFeedbackResponse.setUserFeedbackResponse(userFeedbackResponse);
            allFeedbackResponse.setServiceFeedbackResponse(serviceFeedbackResponse);
            allFeedbackResponse.setFeedbackResponse(feedbackResponse);
            allFeedbackResponses.add(allFeedbackResponse);
        }

        double averageRating = totalFeedback == 0 ? 0.0 : (double) totalRating / totalFeedback;
        Map<Rating, Double> ratingPercentage = new EnumMap<>(Rating.class);
        for (Rating r : Rating.values()) {
            int count = ratingCount.get(r);
            double percent = totalFeedback == 0 ? 0.0 : (100.0 * count / totalFeedback);
            ratingPercentage.put(r, percent);
        }

        FeedbackStatisticsResponse statistics = new FeedbackStatisticsResponse();
        statistics.setAverageRating(averageRating);
        statistics.setRatingPercentage(ratingPercentage);
        statistics.setAllFeedbackResponses(allFeedbackResponses);

        return statistics;
    }

}
