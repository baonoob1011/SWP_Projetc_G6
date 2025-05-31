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
    ServiceTest service;

    public long getAdministrativeServiceId() {
        return administrativeServiceId;
    }

    public void setAdministrativeServiceId(long administrativeServiceId) {
        this.administrativeServiceId = administrativeServiceId;
    }

    public SampleCollectionMethod getSampleCollectionMethod() {
        return sampleCollectionMethod;
    }

    public void setSampleCollectionMethod(SampleCollectionMethod sampleCollectionMethod) {
        this.sampleCollectionMethod = sampleCollectionMethod;
    }

    public ServiceTest getService() {
        return service;
    }

    public void setService(ServiceTest service) {
        this.service = service;
    }
}
