package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.AdministrativeService;
import swp.project.adn_backend.entity.Appointment;

import java.util.List;

@RepositoryRestResource(path = "appointment")
public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    List<Appointment> findByUsers_UserId(Long userId); // nếu user là object
}
