package swp.project.adn_backend.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.IntrospectRequest;
import swp.project.adn_backend.dto.request.LoginDTO;
import swp.project.adn_backend.dto.response.AuthenticationResponse;
import swp.project.adn_backend.dto.response.IntrospectResponse;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.UserRepository;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationService {
    protected static final String SIGNER_KEY =
            "g2n1atsr9e9KvFKy2RePQ/rPREVb3/2+Hcjt7Mb1/PtlOUhBpASAwrVILClWabHI";

    @Autowired
    UserRepository userRepository;


    public AuthenticationResponse authenticate(LoginDTO loginDTO) {
        var user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(loginDTO.getPassword(), user.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCodeUser.UNAUTHENTICATED);
        }

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated("true")
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request)
            throws ParseException, JOSEException {

        var token = request.getToken();
        JWSVerifier jwsVerifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verify = signedJWT.verify(jwsVerifier);

        return IntrospectResponse.builder()
                .valid(verify && expiryTime.after(new Date()))
                .build();
    }

    private String generateToken(Users users) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(users.getUsername())
                .issuer("baotd.com")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
                .claim("role", users.getRole())
                .claim("fullName", users.getFullName())
                .claim("phone", users.getPhone())
                .claim("email", users.getEmail())
                .claim("id",users.getUserId())
                .build();

        SignedJWT signedJWT = new SignedJWT(header, jwtClaimsSet);
        try {
            signedJWT.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return signedJWT.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

//    private String buildScope(Users users) {
//        StringJoiner stringJoiner = new StringJoiner(" ");
//        if (!CollectionUtils.isEmpty(users.getRoles())) {
//            users.getRoles().forEach(role -> stringJoiner.add(role.getRoles()));
//        }
//        return stringJoiner.toString();
//    }

}
