//package swp.project.adn_backend.interceptor;
//
//import jakarta.servlet.http.HttpServletRequest;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.MessageChannel;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.messaging.support.ChannelInterceptor;
//import org.springframework.security.authentication.AbstractAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.stereotype.Component;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//@Configuration
//public class WebsocketConfig implements ChannelInterceptor {
//
//    @Override
//    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//        try {
//            StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
//
//            // Get Authentication from SecurityContext
//            var authentication = SecurityContextHolder.getContext().getAuthentication();
//            if (authentication instanceof AbstractAuthenticationToken token
//                    && token.getPrincipal() instanceof Jwt jwt) {
//
//                Long userId = jwt.getClaim("id");
//                log.info("WebSocket connection by user ID: {}", userId);
//
//                accessor.setUser(authentication);
//            }
//
//        } catch (Exception e) {
//            log.error("Failed to set user in WebSocket session", e);
//        }
//
//        return message;
//    }
//}
