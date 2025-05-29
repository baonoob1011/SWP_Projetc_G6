package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.SampleCollectionMethod;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "CivilService")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CivilService {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "civil_service_id")
    long civilServiceId;

    @Column(name = "sample_collection_method")
    SampleCollectionMethod sampleCollectionMethod;

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "service_id", nullable = false)
    Service service;

    @OneToMany(mappedBy = "civilService", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    List<Kit> kits;
}
