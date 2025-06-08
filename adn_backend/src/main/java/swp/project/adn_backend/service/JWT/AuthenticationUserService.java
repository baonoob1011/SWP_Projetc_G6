package swp.project.adn_backend.service.JWT;

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
import org.springframework.util.CollectionUtils;
//import swp.project.adn_backend.configuration.UserPrincipal;
import swp.project.adn_backend.dto.request.authentication.IntrospectRequest;
import swp.project.adn_backend.dto.request.authentication.LoginDTO;
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
import java.util.StringJoiner;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationUserService {

    protected static final String SIGNER_KEY =
            "g2n1atsr9e9KvFKy2RePQ/rPREVb3/2+Hcjt7Mb1/PtlOUhBpASAwrVILClWabHI";

    @Autowired
    UserRepository userRepository;

    public AuthenticationResponse authenticateUser(LoginDTO loginDTO) {
        var user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        if (!user.getEnabled()) {
            throw new AppException(ErrorCodeUser.USER_DISABLED);  // Bạn cần định nghĩa USER_DISABLED trong enum
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCodeUser.UNAUTHENTICATED);
        }


        // Generate JWT
        String token = generateToken(user);


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
                .issuer("swp.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .claim("role", buildScope(users))
                .claim("id", users.getUserId())
                .claim("phone", users.getPhone())
                .claim("address", users.getAddress())
                .claim("fullName", users.getFullName())
                //              .claim("dayOfBirth", users.getDateOfBirth().toString()) // nếu là LocalDate
                .claim("email", users.getEmail())
//                .claim("enable", users.getEnabled())
//                .claim("gender", users.getGender())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            System.out.println("Cannot create Token");
            throw new RuntimeException(e);
        }
    }

    private String buildScope(Users users) {
        StringJoiner stringJoiner = new StringJoiner("");
        if (!CollectionUtils.isEmpty(users.getRoles())) {
            users.getRoles().forEach(stringJoiner::add);
        }
        return stringJoiner.toString();
    }
}
