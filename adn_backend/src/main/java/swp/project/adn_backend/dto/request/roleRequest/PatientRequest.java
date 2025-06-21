package swp.project.adn_backend.dto.request.roleRequest;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import swp.project.adn_backend.annotation.RequireBirthCertificateIfUnder14;
import swp.project.adn_backend.annotation.RequireIdCardIf16OrOlder;
import swp.project.adn_backend.enums.PatientStatus;
import swp.project.adn_backend.enums.PaymentStatus;


import java.time.LocalDate;

@Getter
@Setter
@RequireBirthCertificateIfUnder14
@RequireIdCardIf16OrOlder
public class PatientRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Email format is invalid")
    private String email;

    @Pattern(regexp = "^\\+?\\d{9,15}$", message = "Phone number format is invalid")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private PatientStatus patientStatus;

    private String identityNumber;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    private String birthCertificate;

    public PatientStatus getPatientStatus() {
        return patientStatus;
    }

    public void setPatientStatus(PatientStatus patientStatus) {
        this.patientStatus = patientStatus;
    }

    public @NotBlank(message = "Full name is required") String getFullName() {
        return fullName;
    }

    public void setFullName(@NotBlank(message = "Full name is required") String fullName) {
        this.fullName = fullName;
    }

    public @NotBlank(message = "Email is required") @Email(message = "Email format is invalid") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is required") @Email(message = "Email format is invalid") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Phone number is required") @Pattern(regexp = "^\\+?\\d{9,15}$", message = "Phone number format is invalid") String getPhone() {
        return phone;
    }

    public void setPhone(@NotBlank(message = "Phone number is required") @Pattern(regexp = "^\\+?\\d{9,15}$", message = "Phone number format is invalid") String phone) {
        this.phone = phone;
    }

    public @NotBlank(message = "Address is required") String getAddress() {
        return address;
    }

    public void setAddress(@NotBlank(message = "Address is required") String address) {
        this.address = address;
    }

    public @NotNull(message = "Date of birth is required") @Past(message = "Date of birth must be in the past") LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(@NotNull(message = "Date of birth is required") @Past(message = "Date of birth must be in the past") LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getIdentityNumber() {
        return identityNumber;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public @NotBlank(message = "Gender is required") String getGender() {
        return gender;
    }

    public void setGender(@NotBlank(message = "Gender is required") String gender) {
        this.gender = gender;
    }

    public @NotBlank(message = "Relationship is required") String getRelationship() {
        return relationship;
    }

    public void setRelationship(@NotBlank(message = "Relationship is required") String relationship) {
        this.relationship = relationship;

    }




    public String getBirthCertificate() {
        return birthCertificate;
    }

    public void setBirthCertificate(String birthCertificate) {
        this.birthCertificate = birthCertificate;
    }
}

