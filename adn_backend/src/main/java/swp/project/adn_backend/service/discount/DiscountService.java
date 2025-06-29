package swp.project.adn_backend.service.discount;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp.project.adn_backend.dto.InfoDTO.AppointmentInfoDTO;
import swp.project.adn_backend.dto.request.discount.DiscountRequest;
import swp.project.adn_backend.dto.response.discount.DiscountResponse;
import swp.project.adn_backend.entity.Discount;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.AppointmentStatus;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.DiscountMapper;
import swp.project.adn_backend.repository.DiscountRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DiscountService {
    DiscountRepository discountRepository;
    DiscountMapper discountMapper;
    ServiceTestRepository serviceTestRepository;
    EntityManager entityManager;

    @Autowired
    public DiscountService(DiscountRepository discountRepository, DiscountMapper discountMapper, ServiceTestRepository serviceTestRepository, EntityManager entityManager) {
        this.discountRepository = discountRepository;
        this.discountMapper = discountMapper;
        this.serviceTestRepository = serviceTestRepository;
        this.entityManager = entityManager;
    }

    public DiscountResponse createDiscount(long serviceId, DiscountRequest discountRequest) {
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        Discount discount = discountMapper.toDiscount(discountRequest);
        discount.setService(serviceTest);

        // Auto set isActive based on current date
        LocalDate today = LocalDate.now();
        if ((today.isEqual(discount.getStartDate()) || today.isAfter(discount.getStartDate())) &&
                (today.isBefore(discount.getEndDate()) || today.isEqual(discount.getEndDate()))) {
            discount.setActive(true);
        } else {
            discount.setActive(false);
        }

        discountRepository.save(discount);
        return discountMapper.toDiscountResponse(discount);
    }

    public List<DiscountResponse> getDiscountByServiceId(long serviceId) {
        String jpql = "SELECT new swp.project.adn_backend.dto.response.discount.DiscountResponse(" +
                "s.discountId, s.discountName, s.discountValue, s.startDate, s.endDate, s.isActive) " +
                "FROM Discount s WHERE s.service.serviceId = :serviceId";
        TypedQuery<DiscountResponse> query = entityManager.createQuery(jpql, DiscountResponse.class);
        query.setParameter("serviceId", serviceId);
        return query.getResultList();
    }

    @Transactional
    public void deleteDiscount(long discountId) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.DISCOUNT_NOT_EXISTS));
        discount.setActive(false);
    }
}
