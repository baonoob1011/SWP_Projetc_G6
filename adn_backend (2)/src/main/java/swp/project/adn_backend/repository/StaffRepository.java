package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Service;
import swp.project.adn_backend.entity.Staff;


@RepositoryRestResource(path = "staff")
public interface StaffRepository extends JpaRepository<Staff,Long> {
}