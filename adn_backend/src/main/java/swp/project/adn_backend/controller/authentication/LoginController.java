package swp.project.adn_backend.controller.authentication;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import swp.project.adn_backend.dto.request.authentication.LoginDTO;
import swp.project.adn_backend.dto.response.APIResponse;
import swp.project.adn_backend.dto.response.AuthenticationResponse;
import swp.project.adn_backend.repository.UserRepository;
import swp.project.adn_backend.service.JWT.AuthenticationUserService;

@RestController
@RequestMapping("/api/auth")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class LoginController {
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);


    AuthenticationUserService authenticationUserService;
    UserRepository userRepository;

    @Autowired
    public LoginController(AuthenticationUserService authenticationUserService, UserRepository userRepository) {
        this.authenticationUserService = authenticationUserService;
        this.userRepository = userRepository;
    }

    @PostMapping("/token")
    public APIResponse<AuthenticationResponse> authenticateUser(@Valid @RequestBody LoginDTO loginDTO) {
        AuthenticationResponse result = authenticationUserService.authenticateUser(loginDTO);


        var authentication = SecurityContextHolder.getContext().getAuthentication();
        logger.info("Username: {}", authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> logger.info(grantedAuthority.getAuthority()));
        return APIResponse.<AuthenticationResponse>builder()
                .code(200)
                .message("Login successful")
                .result(result)
                .build();
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authorities: " + auth.getAuthorities());
        return ResponseEntity.ok(auth.getAuthorities());
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
//       }

}




