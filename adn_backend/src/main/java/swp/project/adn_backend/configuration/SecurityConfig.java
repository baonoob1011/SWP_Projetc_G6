package swp.project.adn_backend.configuration;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import swp.project.adn_backend.enums.Roles;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/**",
            "/api/auth/gg/",
            "/api/otp/**",
            "/api/register/user-account",
            "/oauth/**",
            "/api/patient/**"
    };
    private final String[] PUBLIC_ENDPOINTS_FOR_ADMIN = {
            "/api/**"
    };
    private final String[] PUBLIC_ENDPOINTS_FOR_STAFF = {
            "/api/services/**",
            "/api/staff/**",
    };
    private final String[] PUBLIC_ENDPOINTS_FOR_MANAGER = {
            "/api/user/**",
            "/api/register/staff-account",
            "/api/services/**",
            "/api/manager/**",
            "/api/staff/**"
    };
    protected static final String SIGNER_KEY =
            "g2n1atsr9e9KvFKy2RePQ/rPREVb3/2+Hcjt7Mb1/PtlOUhBpASAwrVILClWabHI";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity security) throws Exception {
        security
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // cấu hình CORS
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(request -> request

                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS).permitAll()

                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_FOR_ADMIN).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, PUBLIC_ENDPOINTS_FOR_ADMIN).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, PUBLIC_ENDPOINTS_FOR_ADMIN).hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_FOR_MANAGER).hasRole("MANAGER")
                        .requestMatchers(HttpMethod.DELETE, PUBLIC_ENDPOINTS_FOR_MANAGER).hasRole("MANAGER")
                        .requestMatchers(HttpMethod.PUT, PUBLIC_ENDPOINTS_FOR_MANAGER).hasRole("MANAGER")
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_FOR_MANAGER).hasRole("MANAGER")

                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_FOR_STAFF).hasRole("STAFF")
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_FOR_STAFF).hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, PUBLIC_ENDPOINTS_FOR_STAFF).hasRole("STAFF")
                        .requestMatchers(HttpMethod.DELETE, PUBLIC_ENDPOINTS_FOR_STAFF).hasRole("STAFF")

                        .anyRequest().authenticated()
                ).logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                        })
                        .deleteCookies("JSESSIONID") // xóa cookie nếu dùng session
                        .invalidateHttpSession(true) // hủy session
                )
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                        jwt.decoder(jwtDecoder()).jwtAuthenticationConverter(jwtAuthenticationConverter()))
                                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                )

                .httpBasic(Customizer.withDefaults());

        return security.build();
    }


    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("role");  // Claim "role" will be used
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");  // Add prefix "ROLE_" to authorities

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}

