package swp.project.adn_backend.service.registerServiceTestService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.InfoDTO.PriceInfoDTO;
import swp.project.adn_backend.dto.InfoDTO.SlotInfoDTO;
import swp.project.adn_backend.dto.request.serviceRequest.AddPriceListRequest;
import swp.project.adn_backend.entity.Discount;
import swp.project.adn_backend.entity.PriceList;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AddPriceListMapper;
import swp.project.adn_backend.repository.ServiceTestRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddPriceListService {
    AddPriceListMapper addPriceListMapper;
    ServiceTestRepository serviceTestRepository;
    EntityManager entityManager;

    @Autowired
    public AddPriceListService(AddPriceListMapper addPriceListMapper, ServiceTestRepository serviceTestRepository, EntityManager entityManager) {
        this.addPriceListMapper = addPriceListMapper;
        this.serviceTestRepository = serviceTestRepository;
        this.entityManager = entityManager;
    }

    public void addMorePriceList(AddPriceListRequest addPriceListRequest,
                                 long serviceId) {
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        PriceList newPriceList = addPriceListMapper.toAddPriceList(addPriceListRequest);
        List<PriceList> priceLists = serviceTest.getPriceLists();
        if (priceLists == null) {
            priceLists = new ArrayList<>();
        }
        priceLists.add(newPriceList);
        serviceTest.setPriceLists(priceLists);
        newPriceList.setService(serviceTest);
        serviceTestRepository.save(serviceTest);
    }

    public List<PriceInfoDTO> getAllPrice(long serviceId) {
        // 1. Tìm service theo ID
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        // 2. Tính tổng phần trăm discount đang active
        double totalDiscountPercent = serviceTest.getDiscounts().stream()
                .filter(Discount::isActive)
                .mapToDouble(Discount::getDiscountValue)
                .sum();

        // 3. Lấy danh sách PriceList và áp dụng discount phần trăm
        List<PriceList> priceLists = serviceTest.getPriceLists();

        return priceLists.stream()
                .map(priceList -> {
                    double originalPrice = priceList.getPrice();
                    double discountedPrice = originalPrice * (1 - totalDiscountPercent / 100.0);

                    return new PriceInfoDTO(
                            priceList.getPriceId(),
                            discountedPrice,
                            priceList.getTime()
                    );
                })
                .collect(Collectors.toList());
    }



}
