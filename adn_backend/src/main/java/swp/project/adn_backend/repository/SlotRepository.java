package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.Slot;

import java.util.List;


@RepositoryRestResource(path = "slot")
public interface SlotRepository extends JpaRepository<Slot, Long> {
    @Query("SELECT s FROM Slot s " +
            "WHERE s.slotStatus = 'AVAILABLE' " +
            "AND (s.slotDate > CURRENT_DATE " +
            "OR (s.slotDate = CURRENT_DATE AND s.startTime > CURRENT_TIME))")
    List<Slot> findAllFutureSlots();


}