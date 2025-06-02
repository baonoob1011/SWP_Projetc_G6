package swp.project.adn_backend.controller;

import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.dto.request.IntrospectRequest;
import swp.project.adn_backend.dto.request.LoginDTO;
import swp.project.adn_backend.dto.response.APIResponse;
import swp.project.adn_backend.dto.response.AuthenticationResponse;
import swp.project.adn_backend.dto.response.IntrospectResponse;
import swp.project.adn_backend.token.AuthenticationManagerService;
import swp.project.adn_backend.token.AuthenticationStaffService;
import swp.project.adn_backend.token.AuthenticationUserService;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class AuthenticationController {

    @Autowired
    AuthenticationUserService authenticationUserService;
    AuthenticationStaffService authenticationStaffService;
    AuthenticationManagerService authenticationManagerService;

    @Autowired
    public AuthenticationController(AuthenticationUserService authenticationUserService, AuthenticationStaffService authenticationStaffService, AuthenticationManagerService authenticationManagerService) {
        this.authenticationUserService = authenticationUserService;
        this.authenticationStaffService = authenticationStaffService;
        this.authenticationManagerService = authenticationManagerService;
    }

    @PostMapping("/token-user")
    public APIResponse<AuthenticationResponse> authenticateUser(@Valid @RequestBody LoginDTO loginDTO) {
        var result = authenticationUserService.authenticateUser(loginDTO);
        return APIResponse.<AuthenticationResponse>builder()
                .code(200)
                .message("Login successful")
                .result(result)
                .build();
    }

    @PostMapping("/token-staff")
    public APIResponse<AuthenticationResponse> authenticateStaff(@Valid @RequestBody LoginDTO loginDTO) {
        var result = authenticationStaffService.authenticateStaff(loginDTO);
        return APIResponse.<AuthenticationResponse>builder()
                .code(200)
                .message("Login successful")
                .result(result)
                .build();
    }

    @PostMapping("/token-manager")
    public APIResponse<AuthenticationResponse> authenticateManager(@Valid @RequestBody LoginDTO loginDTO) {
        var result = authenticationManagerService.authenticateManager(loginDTO);
        return APIResponse.<AuthenticationResponse>builder()
                .code(200)
                .message("Login successful")
                .result(result)
                .build();
    }

//    @PostMapping("/introspect")
//    public APIResponse<IntrospectResponse> authenticate(@Valid @RequestBody IntrospectRequest request) throws ParseException, JOSEException {
//        var result = authenticationService.introspect(request);
//
//        return APIResponse.<IntrospectResponse>builder()
//                .code(200)
//                .message("Login successful")
//                .result(result)
//                .build();
//    }

}




