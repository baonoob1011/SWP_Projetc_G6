package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.ResultStatus;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Result")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    long result_id;

    @Column(name = "collection_date")
    LocalDateTime collectionDate;

    @Column(name = "result_date")
    LocalDateTime resultDate;

    @Column(name = "result_status")
    ResultStatus resultStatus;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "sample_id", nullable = false)
    Sample sample;

    @OneToMany(mappedBy = "result", fetch = FetchType.LAZY, cascade = {
            CascadeType.ALL
    })
    List<ResultLocus> resultLocus;

    @OneToOne(mappedBy = "result")
    ResultDetail resultDetail;
}
