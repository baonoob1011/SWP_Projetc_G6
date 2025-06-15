package swp.project.adn_backend.dto.request.sample;

import jakarta.persistence.Column;
import swp.project.adn_backend.enums.SampleStatus;

import java.time.LocalDateTime;

public class SampleRequest {
    String sampleType;
    LocalDateTime collectionDate;
    SampleStatus sampleStatus;
}
