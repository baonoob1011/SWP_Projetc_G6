package swp.project.adn_backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;
import swp.project.adn_backend.entity.Invoice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByTxnRef(String txnRef);
    boolean existsByTxnRef(String txnRef);

    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.transactionStatus = 'SUCCESS'")
    Long sumSuccessfulAmount();


    @Query(
      value = "SELECT CONVERT(date, pay_date) as payDate, SUM(amount) " +
              "FROM invoices " +
              "WHERE pay_date BETWEEN :startDate AND :endDate " +
              "GROUP BY CONVERT(date, pay_date) " +
              "ORDER BY CONVERT(date, pay_date)",
      nativeQuery = true
    )
    List<Object[]> findDailyRevenueBetween(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.transactionStatus = 'SUCCESS' AND i.payDate BETWEEN :startDate AND :endDate")
    Long sumSuccessfulAmountBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
