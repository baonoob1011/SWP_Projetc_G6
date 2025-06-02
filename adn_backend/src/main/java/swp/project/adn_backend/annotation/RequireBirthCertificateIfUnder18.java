package swp.project.adn_backend.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import swp.project.adn_backend.validator.BirthCertificateValidator;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = BirthCertificateValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireBirthCertificateIfUnder18 {
    String message() default "Birth certificate is required for patients under 18 years old";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
