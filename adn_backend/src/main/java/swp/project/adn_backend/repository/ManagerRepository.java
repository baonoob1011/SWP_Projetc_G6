package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Manager;
import swp.project.adn_backend.entity.Staff;


@RepositoryRestResource(path = "manager")
public interface ManagerRepository extends JpaRepository<Manager,Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}