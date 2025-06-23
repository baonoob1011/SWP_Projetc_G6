package swp.project.adn_backend.dto.response.sample;

import swp.project.adn_backend.enums.PatientStatus;

import java.time.LocalDate;

public class PatientSampleResponse {
    long patientId;
    String fullName;
    LocalDate dateOfBirth;
    String gender;
    String relationship;


    public PatientSampleResponse(long patientId, String fullName, LocalDate dateOfBirth, String gender, String relationship) {
        this.patientId = patientId;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.relationship = relationship;
    }

    public long getPatientId() {
        return patientId;
    }

    public void setPatientId(long patientId) {
        this.patientId = patientId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }
}
