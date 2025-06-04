package swp.project.adn_backend.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import swp.project.adn_backend.annotation.RequireBirthCertificateIfUnder18;
import swp.project.adn_backend.dto.request.PatientRequest;

import java.time.LocalDate;
import java.time.Period;

public class BirthCertificateValidator implements ConstraintValidator<RequireBirthCertificateIfUnder18, PatientRequest> {

    @Override
    public boolean isValid(PatientRequest request, ConstraintValidatorContext context) {
        if (request.getDateOfBirth() == null) return true; // skip if date is null, handled by @NotNull
        int age = Period.between(request.getDateOfBirth(), LocalDate.now()).getYears();

        if (age < 14) {
            return request.getBirthCertificate() != null && !request.getBirthCertificate().trim().isEmpty();
        }

        return true;
    }
}
