package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Room;
import swp.project.adn_backend.entity.Slot;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@RepositoryRestResource(path = "room")
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query(value = """
    SELECT CASE
        WHEN COUNT(*) > 0 THEN 1
        ELSE 0
    END
    FROM room
    WHERE room_id != :roomId
      AND open_time < CAST(:closeTime AS TIME)
      AND close_time > CAST(:openTime AS TIME)
""", nativeQuery = true)
    Integer isRoomTimeOverlapping(
            @Param("roomId") Long roomId,
            @Param("openTime") Time openTime,
            @Param("closeTime") Time closeTime
    );

}