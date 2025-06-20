package swp.project.adn_backend.dto.response.appointment.AppointmentResponse;

import jakarta.persistence.Column;
import swp.project.adn_backend.enums.PatientStatus;

import java.time.LocalDate;

public class PatientAppointmentFullInfoResponse {
    long patientId;
    String fullName;
    String email;
    String phone;
    String address;
    LocalDate dateOfBirth;
    String identityNumber;
    String gender;
    String relationship;
    PatientStatus patientStatus;

    public PatientAppointmentFullInfoResponse(long patientId, String fullName, String email, String phone, String address, LocalDate dateOfBirth, String identityNumber, String gender, String relationship, PatientStatus patientStatus) {
        this.patientId = patientId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.identityNumber = identityNumber;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getIdentityNumber() {
        return identityNumber;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
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
