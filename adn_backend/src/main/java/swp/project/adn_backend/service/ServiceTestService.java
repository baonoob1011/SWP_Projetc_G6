package swp.project.adn_backend.service;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.request.*;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.SampleCollectionMethod;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.*;
import swp.project.adn_backend.repository.AdministrativeServiceRepository;
import swp.project.adn_backend.repository.CivilServiceRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;
import swp.project.adn_backend.repository.UserRepository;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Set;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceTestService {
    UserRepository userRepository;
    ServiceTestMapper serviceTestMapper;
    ServiceTestRepository serviceTestRepository;
    PriceListMapper priceListMapper;
    FeedbackMapper feedbackMapper;
    AdministrativeMapper administrativeMapper;
    CivilServiceMapper civilServiceMapper;
    AdministrativeServiceRepository administrativeServiceRepository;
    CivilServiceRepository civilServiceRepository;

    @Autowired
    public ServiceTestService(UserRepository userRepository, ServiceTestMapper serviceTestMapper, ServiceTestRepository serviceTestRepository, PriceListMapper priceListMapper, FeedbackMapper feedbackMapper, AdministrativeMapper administrativeMapper, CivilServiceMapper civilServiceMapper, AdministrativeServiceRepository administrativeServiceRepository, CivilServiceRepository civilServiceRepository) {
        this.userRepository = userRepository;
        this.serviceTestMapper = serviceTestMapper;
        this.serviceTestRepository = serviceTestRepository;
        this.priceListMapper = priceListMapper;
        this.feedbackMapper = feedbackMapper;
        this.administrativeMapper = administrativeMapper;
        this.civilServiceMapper = civilServiceMapper;
        this.administrativeServiceRepository = administrativeServiceRepository;
        this.civilServiceRepository = civilServiceRepository;
    }

    public ServiceTest createAdministrativeService(ServiceRequest serviceRequest,
                                                   Authentication authentication,
                                                   PriceListRequest priceListRequest,
                                                   AdministrativeServiceRequest administrativeServiceRequest

    ) {
        if (serviceTestRepository.existsByServiceName(serviceRequest.getServiceName())) {
            throw new AppException(ErrorCodeUser.SERVICE_NAME_IS_EXISTED);
        }
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        // service
        ServiceTest serviceTest = serviceTestMapper.toServiceTest(serviceRequest);
        serviceTest.setRegistedDate(LocalDateTime.now());
        serviceTest.setActive(true);
        serviceTest.setUsers(users);

        //Tạo list price
        PriceList priceList = priceListMapper.toPriceList(priceListRequest);
        priceList.setEffectiveDate(LocalDate.now());
        priceList.setService(serviceTest); // 🔥 Rất quan trọng

        List<PriceList> priceLists = new ArrayList<>();
        priceLists.add(priceList);
        serviceTest.setPriceLists(priceLists);

        //AdministrativeService
        AdministrativeService administrativeService = administrativeMapper.toAdministrativeService(administrativeServiceRequest);
        administrativeService.setSampleCollectionMethod(SampleCollectionMethod.AT_CLINIC);
        administrativeService.setService(serviceTest);
        administrativeServiceRepository.save(administrativeService);

        return serviceTestRepository.save(serviceTest);
    }

    public ServiceTest createCivilService(ServiceRequest serviceRequest,
                                          Authentication authentication,
                                          PriceListRequest priceListRequest,
                                          CivilServiceRequest civilServiceRequest

    ) {
        if (serviceTestRepository.existsByServiceName(serviceRequest.getServiceName())) {
            throw new AppException(ErrorCodeUser.SERVICE_NAME_IS_EXISTED);
        }
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        // service
        ServiceTest serviceTest = serviceTestMapper.toServiceTest(serviceRequest);
        serviceTest.setRegistedDate(LocalDateTime.now());
        serviceTest.setActive(true);
        serviceTest.setUsers(users);

        //Tạo list price
        PriceList priceList = priceListMapper.toPriceList(priceListRequest);
        priceList.setEffectiveDate(LocalDate.now());
        priceList.setService(serviceTest); // 🔥 Rất quan trọng

        List<PriceList> priceLists = new ArrayList<>();
        priceLists.add(priceList);
        serviceTest.setPriceLists(priceLists);

        //civilServiceRequest
        CivilService civilService = civilServiceMapper.toCivilService(civilServiceRequest);
        civilService.setSampleCollectionMethods(
                Set.of(SampleCollectionMethod.AT_HOME, SampleCollectionMethod.AT_CLINIC)
        );
        civilServiceRepository.save(civilService);

        return serviceTestRepository.save(serviceTest);
    }

}
