package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.AdministrativeService;
import swp.project.adn_backend.entity.ServiceTest;

import java.util.Optional;

@RepositoryRestResource(path = "administrative-service")
public interface AdministrativeServiceRepository extends JpaRepository<AdministrativeService,Long> {
    Optional<AdministrativeService> findByService(ServiceTest service);

}
