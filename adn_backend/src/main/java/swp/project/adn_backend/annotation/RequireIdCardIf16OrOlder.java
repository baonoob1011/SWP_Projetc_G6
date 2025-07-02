package swp.project.adn_backend.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import swp.project.adn_backend.validator.IdCardValidator;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = IdCardValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireIdCardIf16OrOlder {
    String message() default "Bệnh nhân từ 16 tuổi trở lên bắt buộc phải có số CMND/CCCD";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
