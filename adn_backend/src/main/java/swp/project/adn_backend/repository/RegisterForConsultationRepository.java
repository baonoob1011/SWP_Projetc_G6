package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Blog;
import swp.project.adn_backend.entity.RegisterForConsultation;


@RepositoryRestResource(path = "register-for-consultation")
public interface RegisterForConsultationRepository extends JpaRepository<RegisterForConsultation,Long> {
}
