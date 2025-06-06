//package swp.project.adn_backend.configuration;
//
//
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import swp.project.adn_backend.entity.Users;
//
//import java.util.Collection;
//import java.util.List;
//
//public class UserPrincipal implements UserDetails {
//
//    private final Users user;
//
//    public UserPrincipal(Users user) {
//        this.user = user;
//    }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of(new SimpleGrantedAuthority(user.getRoles())); // Example: "ROLE_USER"
//    }
//
//    @Override
//    public String getPassword() {
//        return user.getPassword();
//    }
//
//    @Override
//    public String getUsername() {
//        return user.getUsername();
//    }
//
//    @Override public boolean isAccountNonExpired() { return true; }
//    @Override public boolean isAccountNonLocked() { return true; }
//    @Override public boolean isCredentialsNonExpired() { return true; }
//    @Override public boolean isEnabled() { return true; }
//
//    public Users getUser() {
//        return user;
//    }
//}
