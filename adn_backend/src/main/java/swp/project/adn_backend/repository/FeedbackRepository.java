package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Discount;
import swp.project.adn_backend.entity.Feedback;
import swp.project.adn_backend.entity.ServiceTest;

import java.util.List;


@RepositoryRestResource(path = "feedback")
public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
    List<Feedback> findByService(ServiceTest service);

}
