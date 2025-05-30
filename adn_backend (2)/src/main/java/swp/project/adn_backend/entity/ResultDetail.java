package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ResultDetail")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_detail_id")
    long resultDetailId;

    @Column(name = "combined_paternity_index")
    double combinedPaternityIndex;

    String conclusion;

    @Column(name = "result_summary")
    String resultSummary;

    @OneToOne
    @JoinColumn(name = "result_id", nullable = false)
    Result result;
}
