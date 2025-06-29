//package swp.project.adn_backend.listener;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.event.EventListener;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.MessageChannel;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.messaging.simp.stomp.StompCommand;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.messaging.support.ChannelInterceptor;
//import org.springframework.messaging.support.MessageHeaderAccessor;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.authority.AuthorityUtils;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.security.oauth2.jwt.JwtDecoder;
//import org.springframework.security.oauth2.jwt.JwtException;
//import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.messaging.SessionDisconnectEvent;
//import swp.project.adn_backend.entity.ChatMessage;
//import swp.project.adn_backend.enums.MessageType;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//@Configuration
//public class WebSocketEventListener implements ChannelInterceptor {
//
//    private final JwtDecoder jwtDecoder;
//
//    @Override
//    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//        StompHeaderAccessor accessor =
//                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
//
//        if (accessor == null) return message;
//
//        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
//            String authHeader = accessor.getFirstNativeHeader("Authorization");
//
//            if (authHeader != null && authHeader.startsWith("Bearer ")) {
//                String token = authHeader.substring(7); // fix: 7 not 10
//
//                try {
//                    Jwt jwt = jwtDecoder.decode(token);
//                    Authentication authentication =
//                            new JwtAuthenticationToken(jwt, AuthorityUtils.NO_AUTHORITIES);
//
//                    accessor.setUser(authentication);
//                    log.info("WebSocket authenticated for user: {}", jwt.getSubject());
//
//                } catch (JwtException e) {
//                    log.warn("JWT decoding failed: {}", e.getMessage());
//                    throw new IllegalArgumentException("Invalid JWT token");
//                }
//            } else {
//                log.warn("Missing or malformed Authorization header in WebSocket CONNECT");
//            }
//        }
//
//        return message;
//    }
//}
