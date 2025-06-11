package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.Location;
import swp.project.adn_backend.entity.Slot;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;



@RepositoryRestResource(path = "slot")
public interface SlotRepository extends JpaRepository<Slot, Long> {
    @Query("SELECT s FROM Slot s " +
            "WHERE s.slotStatus = 'AVAILABLE' " +
            "AND (s.slotDate > CURRENT_DATE " +
            "OR (s.slotDate = CURRENT_DATE AND s.startTime > CURRENT_TIME))")
    List<Slot> findAllFutureSlots();

    @Query(value = """
    SELECT CASE
        WHEN COUNT(*) > 0 THEN 1
        ELSE 0
    END
    FROM slot
    WHERE room_id = :roomId
      AND slot_date = :slotDate
      AND start_time < CAST(:endTime AS TIME)
      AND end_time > CAST(:startTime AS TIME)
""", nativeQuery = true)
    Integer isSlotOverlappingNative(
            @Param("roomId") Long roomId,
            @Param("slotDate") LocalDate slotDate,
            @Param("startTime") Time startTime,
            @Param("endTime") Time endTime
    );



}