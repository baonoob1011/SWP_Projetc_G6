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
@Table(name = "ResultLocus")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResultLocus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_locus_id")
    long resultLocusId;

    @Column(name = "locus_name")
    String locusName;

    @Column(name = "allele_1")
    String allele1;

    @Column(name = "allele_2")
    String allele2;

    double frequency;
    double pi;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "result_id", nullable = false)
    Result result;




}
