package swp.project.adn_backend.service.feedback;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.request.feedback.FeedbackRequest;
import swp.project.adn_backend.dto.request.feedback.FeedbackStatisticsRequest;
import swp.project.adn_backend.dto.response.feedback.*;
import swp.project.adn_backend.entity.Feedback;
import swp.project.adn_backend.entity.FeedbackStatistics;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.Rating;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.FeedbackMapper;
import swp.project.adn_backend.mapper.FeedbackStatisticMapper;
import swp.project.adn_backend.repository.FeedbackRepository;
import swp.project.adn_backend.repository.FeedbackStatisticsRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.time.LocalDate;
import java.util.*;

@Service
public class FeedbackService {
    private FeedbackRepository feedbackRepository;
    private FeedbackMapper feedbackMapper;
    private UserRepository userRepository;
    private ServiceTestRepository serviceTestRepository;
    private FeedbackStatisticMapper feedbackStatisticMapper;
    private final FeedbackStatisticsRepository feedbackStatisticsRepository;

    @Autowired
    public FeedbackService(FeedbackStatisticsRepository feedbackStatisticsRepository, FeedbackStatisticMapper feedbackStatisticMapper, ServiceTestRepository serviceTestRepository, UserRepository userRepository, FeedbackMapper feedbackMapper, FeedbackRepository feedbackRepository) {
        this.feedbackStatisticsRepository = feedbackStatisticsRepository;
        this.feedbackStatisticMapper = feedbackStatisticMapper;
        this.serviceTestRepository = serviceTestRepository;
        this.userRepository = userRepository;
        this.feedbackMapper = feedbackMapper;
        this.feedbackRepository = feedbackRepository;
    }

    @Transactional
    public void feedbackResponse(FeedbackRequest feedbackRequest,
                                             long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.FEEDBACK_NOT_FOUND));
        feedback.setFeedbackResponse(feedbackRequest.getFeedbackResponse());
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

        // 1. Tạo feedback mới
        Feedback feedback = feedbackMapper.toFeedback(feedbackRequest);
        feedback.setDateSubmitted(LocalDate.now());
        feedback.setUsers(userFeedback);
        feedback.setService(serviceTest);
        feedbackRepository.save(feedback);

        // 2. Lấy toàn bộ feedback để cập nhật thống kê
        List<Feedback> feedbacks = feedbackRepository.findByService(serviceTest);

        int totalRating = 0;
        Map<Rating, Integer> ratingCount = new EnumMap<>(Rating.class);
        for (Rating r : Rating.values()) ratingCount.put(r, 0);

        for (Feedback f : feedbacks) {
            Rating r = f.getRating();
            totalRating += r.getValue();
            ratingCount.put(r, ratingCount.get(r) + 1);
        }

        int totalFeedback = feedbacks.size();
        double avgRating = totalFeedback == 0 ? 0.0 : (double) totalRating / totalFeedback;

        Map<Rating, Double> percentMap = new EnumMap<>(Rating.class);
        for (Rating r : Rating.values()) {
            double percent = totalFeedback == 0 ? 0.0 : (100.0 * ratingCount.get(r) / totalFeedback);
            percentMap.put(r, percent);
        }

        // 3. Cập nhật hoặc tạo mới FeedbackStatisticsEntity
        Optional<FeedbackStatistics> optionalStats =
                feedbackStatisticsRepository.findByService(serviceTest);

        FeedbackStatistics stats = optionalStats.orElse(new FeedbackStatistics());
        stats.setService(serviceTest);
        stats.setAverageRating(avgRating);
        stats.setOneStarPercent(percentMap.get(Rating.ONE_STAR));
        stats.setTwoStarPercent(percentMap.get(Rating.TWO_STAR));
        stats.setThreeStarPercent(percentMap.get(Rating.THREE_STAR));
        stats.setFourStarPercent(percentMap.get(Rating.FOUR_STAR));
        stats.setFiveStarPercent(percentMap.get(Rating.FIVE_STAR));
        stats.setUpdatedAt(LocalDate.now());
        feedback.setFeedbackStatistics(stats);
        feedbackStatisticsRepository.save(stats);

        // 4. Trả về response
        return feedbackMapper.toFeedbackResponse(feedback);
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

    public Feedback updateFeedback(Long feedbackId, FeedbackRequest feedbackRequest, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.FEEDBACK_NOT_FOUND));

        if (!Objects.equals(feedback.getUsers().getUserId(), userId)) {
            throw new AppException(ErrorCodeUser.UNAUTHORIZED);
        }

        feedback.setRating(feedbackRequest.getRating());
        feedback.setFeedbackText(feedbackRequest.getFeedbackText());
        feedback.setDateSubmitted(LocalDate.now());

        return feedbackRepository.save(feedback);
    }

    public void deleteFeedback(Long feedbackId, Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.FEEDBACK_NOT_FOUND));

        if (!Objects.equals(feedback.getUsers().getUserId(), userId)) {
            throw new AppException(ErrorCodeUser.UNAUTHORIZED);
        }

        feedbackRepository.delete(feedback);
    }
}
