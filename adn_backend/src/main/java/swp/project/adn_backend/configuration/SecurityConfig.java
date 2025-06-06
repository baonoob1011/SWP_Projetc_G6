package swp.project.adn_backend.configuration;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;
import swp.project.adn_backend.enums.Roles;

import javax.crypto.spec.SecretKeySpec;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/**",
            "/api/otp/**",
            "/api/register/user-account",
            "/api/user/**"
    };


    protected static final String SIGNER_KEY =
            "g2n1atsr9e9KvFKy2RePQ/rPREVb3/2+Hcjt7Mb1/PtlOUhBpASAwrVILClWabHI";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity security) throws Exception {
        security
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // cấu hình CORS
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS).permitAll()
                        // STAFF or MANAGER can access /api/staff/**
<<<<<<< Updated upstream
                        .requestMatchers("/api/appointment/book-appointment","/api/user/**").hasAnyRole("USER")
=======
                        .requestMatchers("/api/appointment/book-appointment").hasAnyRole("USER")
                        .requestMatchers("/api/user/**").hasAnyRole("USER")
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                        .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                        .requestMatchers("/api/staff/update-profile").hasRole("STAFF")
                        .requestMatchers("/api/manager/update-profile").hasRole("MANAGER")
                        .requestMatchers("/api/services/create-service").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/manager/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/register/staff-account").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/**").hasRole("ADMIN")  // matcher rộng cuối cùng

                        // Các request khác yêu cầu xác thực
                        .anyRequest().authenticated()
                ).logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                        })
                        .deleteCookies("JSESSIONID") // xóa cookie nếu dùng session
                        .invalidateHttpSession(true) // hủy session
                )
                .addFilterAfter((request, response, chain) -> {
                    HttpServletRequest httpRequest = (HttpServletRequest) request;
                    System.out.println("Authorization header: " + httpRequest.getHeader("Authorization"));
                    System.out.println("➡️ URI: " + httpRequest.getRequestURI());  // Thêm dòng này
                    System.out.println("➡️ Method: " + httpRequest.getMethod());   // Và dòng này
                    var auth = SecurityContextHolder.getContext().getAuthentication();
                    if (auth != null) {
                        System.out.println("✅ JWT Authentication:");
                        System.out.println("Authorities: " + auth.getAuthorities());
                        System.out.println("Auth class: " + auth.getClass());
                        System.out.println("Is authenticated: " + auth.isAuthenticated());
                        System.out.println("Principal: " + auth.getPrincipal());
                    } else {
                        System.out.println("❌ Authentication is null");
                    }

                    chain.doFilter(request, response);
                }, BearerTokenAuthenticationFilter.class) // 🔄 Sửa filter này


                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                );


        return security.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");  // So 'MANAGER' -> 'ROLE_MANAGER'
        grantedAuthoritiesConverter.setAuthoritiesClaimName("role");

        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
        authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return authenticationConverter;
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

