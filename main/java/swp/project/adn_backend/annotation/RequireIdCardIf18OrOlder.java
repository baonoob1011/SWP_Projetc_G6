package swp.project.adn_backend.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import swp.project.adn_backend.validator.IdCardValidator;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = IdCardValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireIdCardIf18OrOlder {
    String message() default "ID Card is required for patients 18 years old or older";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
