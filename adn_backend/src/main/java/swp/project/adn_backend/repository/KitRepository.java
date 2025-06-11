package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Kit;

import java.util.Optional;


@RepositoryRestResource(path = "kit")
public interface KitRepository extends JpaRepository<Kit,Long> {
    Optional<Kit> findByKitCode(String kitCode);
    boolean existsByKitCode(String kitCode);

}