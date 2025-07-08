package swp.project.adn_backend.service.wallet;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.entity.Staff;
import swp.project.adn_backend.entity.Users;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.repository.UserRepository;
import swp.project.adn_backend.repository.WalletRepository;
import swp.project.adn_backend.repository.WalletTransactionRepository;

@Service
public class WalletService {
    private WalletRepository walletRepository;
    private WalletTransactionRepository walletTransactionRepository;
    private UserRepository userRepository;

    public void CreateWallet(Authentication authentication){
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));

    }
}
