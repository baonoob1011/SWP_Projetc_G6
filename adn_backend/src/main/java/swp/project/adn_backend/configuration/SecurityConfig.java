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
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;
import swp.project.adn_backend.enums.Roles;

import javax.crypto.spec.SecretKeySpec;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {


    private final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/**",
            "/api/otp/**",
            "/api/register/user-account",
            "/api/services/get-all-administrative-service",
            "/api/services/get-all-civil-service",
            "/api/price/get-all-price/**",
            "/api/jasperpdf/**",
            "/api/register-for-consultation/register-consultation/**",
            "/api/blog/get-all-blog",
            "/api/blog/get-blog",
            "/api/discount/get-discount-by-service",
            "/api/services/get-service",
            "/ws/**",                     // Cho phép WebSocket endpoint nếu dùng STOMP
            "/topic/**",
            "/app/**",
            "/api/wallet/**",
            "/api/chat/**"
    };
    private final String[] CASHIER_ENDPOINTS = {
            "/api/cashier/**",
    };

    private final String[] USER_ENDPOINTS = {
            "/api/appointment/book-appointment/**",
            "/api/services/get-service-to-feedback/**",
            "/api/appointment/cancel-appointment/**",
            "/api/appointment/get-appointment/**",
            "/api/appointment/get-all-result/**",
            "/api/appointment/get-history/**",
            "/api/appointment/get-appointment-history-user/**",
            "/api/slot/get-all-slot-user/**",
            "/api/patient/register-info",
            "/api/kit/view-kit-status",
            "/api/location/get-all-location",
            "/api/payment/get-all-payment",
            "/api/payment/change-payment-method",
            "/api/wallet/payment-by-wallet",
            "/api/user/**",
            "/api/payment/**",
            "/api/wallet/get-all-wallet-transition/**",
            "/api/v1/**",
            "/api/appointment/book-appointment-at-home/**",
            "/api/appointment/cancel-appointment/**",
            "/api/kit-delivery-status/get-kit-status-user/**",
            "/api/feedback/create-feedback/**",
            "/api/feedback/get-all-feedback-of-service/**",
            "/api/invoice/get-invoice-of-user/**",
    };
    private final String[] STAFF_PUBLIC = {
            "/api/sample/get-all-sample/**",
            "/api/notification/get-notification/**",
            "/api/appointment/get-appointment-at-home-to-get-sample",
            "/api/sample/update-status-sample/**",
            "/api/kit-delivery-status/get-kit-status-staff/**",
            "/api/staff/**",
    };
    private final String[] CONSULTANT_PUBLIC = {
            "/api/register-for-consultation/get-register-consultation",
            "/api/register-for-consultation/update-register-consultation-status",


    };
    private final String[] STAFF_ENDPOINTS = {
            "/api/staff/update-profile",
            "/api/kit/get-all-kit-staff",
            "/api/kit/decrease-quantity-kit",
            "/api/kit/update-kit/**",
            "/api/blog/**",
            "/api/appointment/confirm-appointment-at-center/**",
            "/api/appointment/confirm-appointment-at-home/**",
            "/api/appointment/get-appointment-by-slot/**",
            "/api/appointment/get-appointment-of-user-by-phone/**",
            "/api/appointment/get-payment-at-center/**",
            "/api/appointment/check-in-patient/**",
            "/api/slot/get-all-slot-of-staff/**",
            "/api/slot/get-all-slot/**",
//            "/api/slot/get-all-slot-staff/**",
            "/api/slot/get-all-slot-staff-collector/**",
            "/api/kit-delivery-status/update-kit-status/**",
            "/api/feedback/response-feedback",
            "/api/appointment/get-appointment-at-home-by-staff",
            "/api/kit-delivery-status/get-kit-status-staff-by-appointment/**",
            "/api/sample/**",
            "/api/sample/collect-sample-patient-at-center",

    };

    private final String[] LAB_TECHNICIAN = {
            "/api/result-allele/create-result-allele",
            "/api/result-allele/get-result-allele",
            "/api/result-locus/create-result-locus/**",
            "/api/result-detail/create-result-detail/**",
            "/api/locus/get-all-locus",
            "/api/appointment/update-note",
            "/api/appointment/book-appointment-again",
            "/api/appointment/appointment-refund",

    };
    private final String[] MANAGER_ENDPOINTS = {
//            "/api/manager/update-profile",
//            "/api/manager/**",
//            "/api/services/**",
//            "/api/blog/**",
//            "/api/slot/**",
//            "/api/price/**",
//            "/api/room/**",
//            "/api/payment/**",
//            "/api/appointment/**",
//            "/api/kit/**",
//            "/api/staff/get-all-staff",
//            "/api/discount/create-discount-service",
//            "/api/dashboard/**"
            "api/**"
    };

    private final String[] ADMIN_ENDPOINTS = {
            "/api/admin/**",
            "/api/**"  // các api còn lại mặc định ADMIN
    };


    protected static final String SIGNER_KEY =
            "g2n1atsr9e9KvFKy2RePQ/rPREVb3/2+Hcjt7Mb1/PtlOUhBpASAwrVILClWabHI";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity security) throws Exception {
        security
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // cấu hình CORS
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()

                        // Quyền USER
                        .requestMatchers(USER_ENDPOINTS).hasAnyRole("USER", "ADMIN", "MANAGER")
                        .requestMatchers(CASHIER_ENDPOINTS).hasAnyRole("CASHIER", "ADMIN")
                        .requestMatchers(CONSULTANT_PUBLIC).hasAnyRole("CONSULTANT", "ADMIN")
                        .requestMatchers(LAB_TECHNICIAN).hasAnyRole("LAB_TECHNICIAN", "ADMIN", "MANAGER")
                        .requestMatchers(STAFF_PUBLIC).hasAnyRole("STAFF", "LAB_TECHNICIAN", "CASHIER", "ADMIN", "MANAGER", "CONSULTANT")

                        // Quyền STAFF
                        .requestMatchers(STAFF_ENDPOINTS).hasAnyRole("STAFF", "MANAGER", "ADMIN")

                        // Quyền MANAGER
                        .requestMatchers(MANAGER_ENDPOINTS).hasAnyRole("MANAGER", "ADMIN")

                        // Quyền ADMIN
                        .requestMatchers(ADMIN_ENDPOINTS).hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(ADMIN_ENDPOINTS).hasAuthority("ROLE_ADMIN")


                        // Các request khác yêu cầu xác thực
                        .anyRequest().authenticated()
                ).oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint()))
                .csrf(AbstractHttpConfigurer::disable)
                .logout(logout -> logout
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
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("*");
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}

