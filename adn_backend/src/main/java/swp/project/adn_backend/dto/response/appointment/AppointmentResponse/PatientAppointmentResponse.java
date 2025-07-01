package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import swp.project.adn_backend.entity.Sample;
import swp.project.adn_backend.enums.PatientStatus;

import java.time.LocalDate;

public class PatientAppointmentResponse {
    long patientId;
    String fullName;
    LocalDate dateOfBirth;
    String gender;
    String relationship;
    PatientStatus patientStatus;


    public PatientAppointmentResponse() {
    }

    public PatientAppointmentResponse(long patientId, String fullName, LocalDate dateOfBirth, String gender, String relationship, PatientStatus patientStatus) {
        this.patientId = patientId;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.relationship = relationship;
        this.patientStatus = patientStatus;
    }

    public PatientStatus getPatientStatus() {
        return patientStatus;
    }

    public void setPatientStatus(PatientStatus patientStatus) {
        this.patientStatus = patientStatus;
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
