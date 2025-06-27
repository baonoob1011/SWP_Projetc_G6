package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Discount;
import swp.project.adn_backend.entity.Feedback;
import swp.project.adn_backend.entity.ServiceTest;

import java.util.List;


@RepositoryRestResource(path = "feedback")
public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
    List<Feedback> findByService(ServiceTest service);
    
    /**
     * Lấy thống kê đánh giá theo từng service
     */
    @Query("SELECT s.serviceId, s.serviceName, AVG(\n" +
           "CASE f.rating \n" +
           "WHEN 'ONE_STAR' THEN 1 \n" +
           "WHEN 'TWO_STAR' THEN 2 \n" +
           "WHEN 'THREE_STAR' THEN 3 \n" +
           "WHEN 'FOUR_STAR' THEN 4 \n" +
           "WHEN 'FIVE_STAR' THEN 5 \n" +
           "ELSE 0 END), COUNT(f), s.serviceType " +
           "FROM ServiceTest s " +
           "LEFT JOIN s.feedbacks f " +
           "GROUP BY s.serviceId, s.serviceName, s.serviceType " +
           "ORDER BY AVG(\n" +
           "CASE f.rating \n" +
           "WHEN 'ONE_STAR' THEN 1 \n" +
           "WHEN 'TWO_STAR' THEN 2 \n" +
           "WHEN 'THREE_STAR' THEN 3 \n" +
           "WHEN 'FOUR_STAR' THEN 4 \n" +
           "WHEN 'FIVE_STAR' THEN 5 \n" +
           "ELSE 0 END) DESC")
    List<Object[]> getServiceRatingStats();
}
