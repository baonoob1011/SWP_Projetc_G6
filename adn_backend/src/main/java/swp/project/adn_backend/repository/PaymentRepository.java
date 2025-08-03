package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import swp.project.adn_backend.entity.Payment;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Tổng tiền thành công
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.getPaymentStatus = 'PAID'")
    Double sumSuccessfulAmount();

    // Tổng tiền thành công giữa 2 ngày
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.getPaymentStatus = 'PAID' " +
           "AND p.transitionDate BETWEEN :startDate AND :endDate")
    Double sumSuccessfulAmountBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Doanh thu theo ngày
    @Query(
      value = "SELECT CONVERT(date, transition_date) as payDate, SUM(amount) " +
              "FROM payment " +
              "WHERE transition_date BETWEEN :startDate AND :endDate " +
              "AND get_payment_status = 'PAID' " +
              "GROUP BY CONVERT(date, transition_date) " +
              "ORDER BY CONVERT(date, transition_date)",
      nativeQuery = true
    )
    List<Object[]> findDailyRevenueBetween(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    // Doanh thu theo năm
    @Query(
      value = "SELECT YEAR(transition_date) as year, SUM(amount) as revenue " +
              "FROM payment " +
              "WHERE transition_date BETWEEN :startDate AND :endDate " +
              "AND get_payment_status = 'PAID' " +
              "GROUP BY YEAR(transition_date) " +
              "ORDER BY YEAR(transition_date)",
      nativeQuery = true
    )
    List<Object[]> findYearlyRevenueBetween(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    // Đếm số lượng payment theo trạng thái
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.getPaymentStatus = :status")
    long countByGetPaymentStatus(@Param("status") String status);
}