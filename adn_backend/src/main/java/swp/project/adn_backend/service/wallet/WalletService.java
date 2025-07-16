package swp.project.adn_backend.service.wallet;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.WalletInfoAmountDTO;
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
    private EntityManager entityManager;

    @Autowired
    public WalletService(WalletRepository walletRepository, WalletTransactionRepository walletTransactionRepository, UserRepository userRepository, EntityManager entityManager) {
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
    }

    public void CreateWallet(Authentication authentication){
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.STAFF_NOT_EXISTED));

    }
    public WalletInfoAmountDTO getWalletAmount(Authentication authentication){
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));
        String jpql = "SELECT new swp.project.adn_backend.dto.InfoDTO.WalletInfoAmountDTO(" +
                "s.walletId, s.balance) " +
                "FROM Wallet s WHERE s.user.userId = :userId";
        TypedQuery<WalletInfoAmountDTO> query = entityManager.createQuery(jpql, WalletInfoAmountDTO.class);
        query.setParameter("userId", userId);
        return query.getSingleResult();
    }
}
