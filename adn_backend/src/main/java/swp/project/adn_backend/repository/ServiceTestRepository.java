package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.ServiceTest;


@RepositoryRestResource(path = "service")
public interface ServiceTestRepository extends JpaRepository<ServiceTest,Long> {
    boolean existsByServiceName(String serviceName);
}