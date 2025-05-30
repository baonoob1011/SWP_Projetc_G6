package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import swp.project.adn_backend.enums.SampleCollectionMethod;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AdministrativeService")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdministrativeService {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "administrative_service_id")
    long administrativeServiceId;

    @Column(name = "sample_collection_method ")
    SampleCollectionMethod sampleCollectionMethod;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "service_id", nullable = false)
    Service service;


}
