package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.Kit;
import swp.project.adn_backend.entity.Location;
import swp.project.adn_backend.entity.Slot;
import swp.project.adn_backend.enums.SlotStatus;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;



@RepositoryRestResource(path = "slot")
public interface SlotRepository extends JpaRepository<Slot, Long> {
    @Query("SELECT s FROM Slot s " +
            "WHERE s.slotStatus = 'AVAILABLE' " +
            "AND (s.slotDate > CURRENT_DATE " +
            "OR (s.slotDate = CURRENT_DATE AND s.startTime > CURRENT_TIME))")
    List<Slot> findAllFutureSlots();

    List<Slot> findBySlotDateAndSlotStatus(LocalDate slotDate, SlotStatus slotStatus);


    @Query("SELECT DISTINCT s FROM Slot s JOIN s.staff staff " +
            "WHERE LOWER(staff.role) = 'STAFF' OR LOWER(staff.role) = 'SAMPLE_COLLECTOR'")
    List<Slot> findSlotsWithStaffHavingAllowedRoles();

    @Query("SELECT s FROM Slot s WHERE s.slotStatus = :status AND " +
            "(s.slotDate > :today OR (s.slotDate = :today AND s.endTime > :now))")
    List<Slot> findAvailableFutureSlots(@Param("status") SlotStatus status,
                                        @Param("today") LocalDate today,
                                        @Param("now") LocalTime now);


//
//    @Query(value = """
//    SELECT CASE
//        WHEN COUNT(*) > 0 THEN 1
//        ELSE 0
//    END
//    FROM slot
//    WHERE room_id = :roomId
//      AND slot_date = :slotDate
//      AND start_time < CAST(:endTime AS TIME)
//      AND end_time > CAST(:startTime AS TIME)
//""", nativeQuery = true)
//    Integer isSlotOverlappingNative(
//            @Param("roomId") Long roomId,
//            @Param("slotDate") LocalDate slotDate,
//            @Param("startTime") Time startTime,
//            @Param("endTime") Time endTime
//    );
//    @Query("SELECT s FROM Slot s WHERE s.room.id = :roomId " +
//            "AND (s.slotDate > :today OR (s.slotDate = :today AND s.endTime > :nowTime)) " +
//            "AND s.slotStatus = 'AVAILABLE'")
//    List<Slot> findUpcomingSlotsByRoom(@Param("roomId") Long roomId,
//                                       @Param("today") LocalDate today,
//                                       @Param("nowTime") LocalTime nowTime);

//    @Query("""
//    SELECT CASE
//        WHEN COUNT(s) > 0 THEN true
//        ELSE false
//    END
//    FROM Slot s
//    WHERE s.room.roomId = :roomId
//      AND (s.slotDate > :today
//           OR (s.slotDate = :today AND s.endTime > :now))
//""")
//    boolean existsByRoomIdAndSlotDateAfterOrSlotDateEqualsAndEndTimeAfter(
//            @Param("roomId") Long roomId,
//            @Param("today") LocalDate today,
//            @Param("now") Time now
//    );

    @Query(value = """
        SELECT CASE
            WHEN COUNT(*) > 0 THEN 1
            ELSE 0
        END
        FROM slot
        WHERE room_id = :roomId
          AND (
                slot_date > :today
                OR (slot_date = :today AND end_time > :nowTime)
          )
    """, nativeQuery = true)
    int existsFutureSlots(
            @Param("roomId") Long roomId,
            @Param("today") LocalDate today,
            @Param("nowTime") Time nowTime
    );



    @Query(value = """
        SELECT * FROM slot
        WHERE room_id = :roomId
          AND (
              slot_date > :today
              OR (slot_date = :today AND end_time > CAST(:nowTime AS TIME))
          )
    """, nativeQuery = true)
    List<Slot> findUpcomingSlotsNative(
            @Param("roomId") Long roomId,
            @Param("today") LocalDate today,
            @Param("nowTime") Time nowTime
    );

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
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );


    @Query(value = """
    SELECT * FROM slot
    WHERE slot_date = :slotDate
      AND end_time < CAST(:nowTime AS TIME)
      AND slot_status = 'AVAILABLE'
""", nativeQuery = true)
    List<Slot> findExpiredSlots(
            @Param("slotDate") LocalDate slotDate,
            @Param("nowTime") LocalTime nowTime
    );
    List<Slot> findAllBySlotDate(LocalDate slotDate);

    //validation staff k trung thoi gian da book
    @Query(value = """
    SELECT COUNT(*) 
    FROM staff_slot ss
    JOIN slot s ON ss.slot_id = s.slot_id
    WHERE ss.staff_id = :staffId
      AND s.slot_date = :slotDate
      AND (
            s.start_time < CAST(:endTime AS time) 
            AND s.end_time > CAST(:startTime AS time)
          )
""", nativeQuery = true)
    Integer isStaffOverlappingSlot(
            @Param("staffId") long staffId,
            @Param("slotDate") LocalDate slotDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

}