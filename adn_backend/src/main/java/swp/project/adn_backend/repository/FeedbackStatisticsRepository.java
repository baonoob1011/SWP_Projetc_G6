package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.FeedbackStatistics;
import swp.project.adn_backend.entity.ServiceTest;

import java.util.Optional;


@RepositoryRestResource(path = "blog")
public interface FeedbackStatisticsRepository extends JpaRepository<FeedbackStatistics,Long> {
    Optional<FeedbackStatistics> findByService(ServiceTest service);

}
