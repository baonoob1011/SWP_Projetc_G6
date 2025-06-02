package swp.project.adn_backend.controller.authentication;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.request.LoginDTO;
import swp.project.adn_backend.dto.response.APIResponse;
import swp.project.adn_backend.dto.response.AuthenticationResponse;
import swp.project.adn_backend.JWT.AuthenticationUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor

public class LoginController {
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);


    @Autowired
    AuthenticationUserService authenticationUserService;

    @PostMapping("/token")
    public APIResponse<AuthenticationResponse> authenticateUser(@Valid @RequestBody LoginDTO loginDTO) {
        AuthenticationResponse result = authenticationUserService.authenticateUser(loginDTO);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            logger.info("User '{}' logged in with roles: {}",
                    authentication.getName(),
                    authentication.getAuthorities());
        } else {
            logger.warn("Authentication is null after login for '{}'", loginDTO.getUsername());
        }

        return APIResponse.<AuthenticationResponse>builder()
                .code(200)
                .message("Login successful")
                .result(result)
                .build();
    }





//    @PostMapping("/introspect")
//    public APIResponse<IntrospectResponse> authenticate(@Valid @RequestBody IntrospectRequest request) throws ParseException, JOSEException {
//        var result = authenticationUserService.introspect(request);
//
//        return APIResponse.<IntrospectResponse>builder()
//                .code(200)
//                .message("Login successful")
//                .result(result)
//                .build();
//    }

}




