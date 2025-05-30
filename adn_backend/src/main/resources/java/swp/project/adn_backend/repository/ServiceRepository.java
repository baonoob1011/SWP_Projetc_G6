package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Sample;
import swp.project.adn_backend.entity.Service;


@RepositoryRestResource(path = "service")
public interface ServiceRepository extends JpaRepository<Service,Long> {
}