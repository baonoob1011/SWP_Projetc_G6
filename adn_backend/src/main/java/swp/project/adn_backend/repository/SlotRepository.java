package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.Slot;


@RepositoryRestResource(path = "slot")
public interface SlotRepository extends JpaRepository<Slot,Long> {
}