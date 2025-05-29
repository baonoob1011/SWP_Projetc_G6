package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.AdministrativeService;
import swp.project.adn_backend.entity.Appointment;

@RepositoryRestResource(path = "appointment")
public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
}
