package swp.project.adn_backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;


@Entity
public class Locus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locusId;
    @Column(unique = true)
    private String locusName;
    @Column(columnDefinition = "nvarchar(255)")
    private String description; // nếu cần

    // Mapping nếu cần


    public Long getLocusId() {
        return locusId;
    }

    public void setLocusId(Long locusId) {
        this.locusId = locusId;
    }

    public String getLocusName() {
        return locusName;
    }

    public void setLocusName(String locusName) {
        this.locusName = locusName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

