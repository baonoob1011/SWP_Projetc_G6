package swp.project.adn_backend.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import swp.project.adn_backend.validator.BirthCertificateValidator;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = BirthCertificateValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireBirthCertificateIfUnder14 {
    String message() default  "Trẻ dưới 14 tuổi phải có giấy khai sinh";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
