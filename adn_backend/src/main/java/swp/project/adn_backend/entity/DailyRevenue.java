package swp.project.adn_backend.entity;


import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_revenue")
public class DailyRevenue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "revenue_date", nullable = false, unique = true)
    private LocalDate revenueDate;

    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;

    public DailyRevenue() {
    }



    public DailyRevenue(Long totalAmount, LocalDate revenueDate) {
        this.totalAmount = totalAmount;
        this.revenueDate = revenueDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getRevenueDate() {
        return revenueDate;
    }

    public void setRevenueDate(LocalDate revenueDate) {
        this.revenueDate = revenueDate;
    }

    public Long getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Long totalAmount) {
        this.totalAmount = totalAmount;
    }
}
