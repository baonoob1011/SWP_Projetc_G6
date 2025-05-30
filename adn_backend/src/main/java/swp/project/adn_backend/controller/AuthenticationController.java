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
import swp.project.adn_backend.service.AuthenticationService;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class AuthenticationController {

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/token")
    public APIResponse<AuthenticationResponse> authenticate(@Valid @RequestBody LoginDTO loginDTO) {
        var result = authenticationService.authenticate(loginDTO);

        return APIResponse.<AuthenticationResponse>builder()
                .code(200)
                .message("Login successful")
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    public APIResponse<IntrospectResponse> authenticate(@Valid @RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);

        return APIResponse.<IntrospectResponse>builder()
                .code(200)
                .message("Login successful")
                .result(result)
                .build();
    }

}




