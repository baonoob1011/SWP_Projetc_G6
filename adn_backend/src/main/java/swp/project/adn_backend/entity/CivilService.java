package swp.project.adn_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import swp.project.adn_backend.enums.SampleCollectionMethod;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "CivilService")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CivilService {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "civil_service_id")
    long civilServiceId;

    // Lưu nhiều enum
    @ElementCollection(targetClass = SampleCollectionMethod.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "civil_service_sample_methods", joinColumns = @JoinColumn(name = "admin_service_id"))
    @Column(name = "sample_collection_method")
    private Set<SampleCollectionMethod> sampleCollectionMethods = new HashSet<>();

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "service_id", nullable = false)
    ServiceTest service;


    public CivilService() {
    }

    public long getCivilServiceId() {
        return civilServiceId;
    }

    public void setCivilServiceId(long civilServiceId) {
        this.civilServiceId = civilServiceId;
    }

    public Set<SampleCollectionMethod> getSampleCollectionMethods() {
        return sampleCollectionMethods;
    }

    public void setSampleCollectionMethods(Set<SampleCollectionMethod> sampleCollectionMethods) {
        this.sampleCollectionMethods = sampleCollectionMethods;
    }

    public ServiceTest getService() {
        return service;
    }

    public void setService(ServiceTest service) {
        this.service = service;
    }

}
