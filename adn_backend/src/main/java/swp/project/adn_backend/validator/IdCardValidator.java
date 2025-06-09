package swp.project.adn_backend.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import swp.project.adn_backend.annotation.RequireIdCardIf16OrOlder;
import swp.project.adn_backend.dto.request.roleRequest.PatientRequest;

import java.time.LocalDate;
import java.time.Period;

public class IdCardValidator implements ConstraintValidator<RequireIdCardIf16OrOlder, PatientRequest> {

    @Override
    public boolean isValid(PatientRequest request, ConstraintValidatorContext context) {
        if (request.getDateOfBirth() == null) return true;

        int age = Period.between(request.getDateOfBirth(), LocalDate.now()).getYears();

        if (age >= 16) {
            return request.getIdentityNumber() != null && !request.getIdentityNumber().trim().isEmpty();
        }

        return true;
    }
}

