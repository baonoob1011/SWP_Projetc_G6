package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.ServiceType;

import java.util.List;
import java.util.Optional;


@RepositoryRestResource(path = "service")
public interface ServiceTestRepository extends JpaRepository<ServiceTest,Long> {
    boolean existsByServiceName(String serviceName);
//    Optional<ServiceTest> existsByServiceName(String serviceName);
    public List<ServiceTest> findByIsActiveTrue();
    public List<ServiceTest> findAllByServiceType(ServiceType serviceType);

}