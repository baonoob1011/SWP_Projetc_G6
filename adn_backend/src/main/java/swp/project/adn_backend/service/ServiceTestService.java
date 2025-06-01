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

    public ServiceTest createService(ServiceRequest serviceRequest,
                                     Authentication authentication,
                                     PriceListRequest priceListRequest,
                                     AdministrativeServiceRequest administrativeServiceRequest,
                                     CivilServiceRequest civilServiceRequest,
                                     MultipartFile file) {

        if (serviceTestRepository.existsByServiceName(serviceRequest.getServiceName())) {
            throw new AppException(ErrorCodeUser.SERVICE_NAME_IS_EXISTED);
        }

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = jwt.getClaim("id");
        Users users = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.USER_NOT_EXISTED));

        // Map service
        ServiceTest serviceTest = serviceTestMapper.toServiceTest(serviceRequest);
        serviceTest.setRegistedDate(LocalDateTime.now());
        serviceTest.setActive(true);
        serviceTest.setUsers(users);

        if (file != null && !file.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                serviceTest.setImage(base64Image);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        }

        // Price list
        PriceList priceList = priceListMapper.toPriceList(priceListRequest);
        priceList.setEffectiveDate(LocalDate.now());
        priceList.setService(serviceTest);
        serviceTest.setPriceLists(List.of(priceList));

        // Branch logic based on service type
        switch (serviceRequest.getServiceType()) {
            case ADMINISTRATIVE -> {
                AdministrativeService administrativeService = administrativeMapper.toAdministrativeService(administrativeServiceRequest);
                administrativeService.setSampleCollectionMethod(SampleCollectionMethod.AT_CLINIC);
                administrativeService.setService(serviceTest);
                administrativeServiceRepository.save(administrativeService);
            }

            case CIVIL -> {
                CivilService civilService = civilServiceMapper.toCivilService(civilServiceRequest);
                civilService.setService(serviceTest);
                civilServiceRepository.save(civilService);
            }

            default -> throw new AppException(ErrorCodeUser.INVALID_REQUEST);
        }

        return serviceTestRepository.save(serviceTest);
    }


    public void deleteServiceTest(long serviceId) {
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));
        serviceTest.setActive(false);
    }
//    public void updateService(long serviceId){
//        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
//                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));
//        serviceTest=serviceTestMapper.toServiceTest(new ServiceRequest());
//
//    }
}
