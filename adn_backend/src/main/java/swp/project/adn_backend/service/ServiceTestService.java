package swp.project.adn_backend.service;


import jakarta.persistence.EntityManager;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.request.*;
import swp.project.adn_backend.dto.response.serviceResponse.*;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.SampleCollectionMethod;
import swp.project.adn_backend.enums.ServiceType;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.*;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.dto.request.AdministrativeServiceRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;


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
    PriceListRepository priceListRepository;
    EntityManager entityManager;
    UserMapper userMapper;

    @Autowired
    public ServiceTestService(UserRepository userRepository, ServiceTestMapper serviceTestMapper, ServiceTestRepository serviceTestRepository, PriceListMapper priceListMapper, FeedbackMapper feedbackMapper, AdministrativeMapper administrativeMapper, CivilServiceMapper civilServiceMapper, AdministrativeServiceRepository administrativeServiceRepository, CivilServiceRepository civilServiceRepository, PriceListRepository priceListRepository, EntityManager entityManager, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.serviceTestMapper = serviceTestMapper;
        this.serviceTestRepository = serviceTestRepository;
        this.priceListMapper = priceListMapper;
        this.feedbackMapper = feedbackMapper;
        this.administrativeMapper = administrativeMapper;
        this.civilServiceMapper = civilServiceMapper;
        this.administrativeServiceRepository = administrativeServiceRepository;
        this.civilServiceRepository = civilServiceRepository;
        this.priceListRepository = priceListRepository;
        this.entityManager = entityManager;
        this.userMapper = userMapper;
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

        // Map ServiceTest
        ServiceTest serviceTest = serviceTestMapper.toServiceTest(serviceRequest);
        serviceTest.setRegisterDate(LocalDate.now());
        serviceTest.setActive(true);
        serviceTest.setUsers(users);

        // Upload image if present
        if (file != null && !file.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                serviceTest.setImage(base64Image);
            } catch (IOException e) {
                throw new AppException(ErrorCodeUser.INTERNAL_ERROR);
            }
        }

        // Price list
        PriceList priceList = priceListMapper.toPriceList(priceListRequest);
        priceList.setEffectiveDate(LocalDate.now());
        priceList.setService(serviceTest);
        serviceTest.setPriceLists(new ArrayList<>(List.of(priceList)));

        // Branch logic by service type
        switch (serviceRequest.getServiceType()) {
            case ADMINISTRATIVE -> {
                AdministrativeService administrativeService = new AdministrativeService();
                administrativeService.setSampleCollectionMethod(SampleCollectionMethod.AT_CLINIC);
                administrativeService.setService(serviceTest);
                administrativeServiceRepository.save(administrativeService);
            }

            case CIVIL -> {
                CivilService civilService = new CivilService();
                Set<SampleCollectionMethod> defaultMethods = new HashSet<>();
                defaultMethods.add(SampleCollectionMethod.AT_CLINIC);
                defaultMethods.add(SampleCollectionMethod.AT_HOME);
                civilService.setSampleCollectionMethods(defaultMethods);
                civilService.setService(serviceTest);
                civilServiceRepository.save(civilService);
            }

            default -> throw new AppException(ErrorCodeUser.INVALID_REQUEST);
        }

        return serviceTestRepository.save(serviceTest);
    }

    public List<FullServiceTestResponse> getAllService() {
        List<ServiceTest> serviceTests = serviceTestRepository.findAll();
        List<FullServiceTestResponse> responses = new ArrayList<>();
        FullServiceTestResponse fullServiceTestResponse = null;
        for (ServiceTest serviceTest : serviceTests) {
            GetAllServiceResponse getAllServiceResponse = serviceTestMapper.toGetAllServiceTestResponse(serviceTest);
            // get Price List
            List<PriceListResponse> priceListResponses = new ArrayList<>();
            for (PriceList priceList : serviceTest.getPriceLists()) {
                PriceListResponse priceListResponse = priceListMapper.toPriceListResponse(priceList);
                priceListResponses.add(priceListResponse);
            }
            UserCreateServiceResponse userResponse = userMapper.toUserCreateServiceResponse(serviceTest.getUsers());

            fullServiceTestResponse = new FullServiceTestResponse();
            fullServiceTestResponse.setServiceRequest(getAllServiceResponse);
            fullServiceTestResponse.setPriceListRequest(priceListResponses);
            fullServiceTestResponse.setUserCreateServiceResponse(userResponse);
            responses.add(fullServiceTestResponse);
        }
        return responses;
    }

    public List<FullAdministrationServiceResponse> getAdministrativeServices() {
        List<ServiceTest> services = serviceTestRepository.findAllByServiceType(ServiceType.ADMINISTRATIVE);
        List<FullAdministrationServiceResponse> responses = new ArrayList<>();

        for (ServiceTest s : services) {
            // Convert service entity to DTO
            ServiceTestResponse serviceReq = serviceTestMapper.toServiceTestResponse(s);

            // Convert price list
            List<PriceListResponse> priceReqs = new ArrayList<>();
            if (s.getPriceLists() != null && !s.getPriceLists().isEmpty()) {
                for (PriceList p : s.getPriceLists()) {
                    PriceListResponse res = new PriceListResponse();
                    res.setTime(p.getTime());
                    res.setPrice(p.getPrice());
                    priceReqs.add(res);
                }
            }

            // Convert administrative services
            List<AdministrativeServiceResponse> administrativeServiceResponses = new ArrayList<>();
            List<AdministrativeService> administrativeServices = s.getAdministrativeService();
            if (administrativeServices != null && !administrativeServices.isEmpty()) {
                for (AdministrativeService administrativeService : s.getAdministrativeService()) {
                    AdministrativeServiceResponse administrativeServiceResponse = new AdministrativeServiceResponse();
                    administrativeServiceResponse.setSampleCollectionMethod(administrativeService.getSampleCollectionMethod()); // Set enum list
                    administrativeServiceResponses.add(administrativeServiceResponse);
                }
            }


            // Build full response
            FullAdministrationServiceResponse fullResp = new FullAdministrationServiceResponse();
            fullResp.setServiceRequest(serviceReq);
            fullResp.setPriceListRequest(priceReqs);
            fullResp.setAdministrativeServiceRequest(administrativeServiceResponses);

            responses.add(fullResp);
        }

        return responses;
    }

    public List<FullCivilServiceResponse> getCivilServices() {
        List<ServiceTest> services = serviceTestRepository.findAllByServiceType(ServiceType.CIVIL);
        List<FullCivilServiceResponse> responses = new ArrayList<>();

        for (ServiceTest s : services) {
            // Convert service entity to DTO
            ServiceTestResponse serviceReq = serviceTestMapper.toServiceTestResponse(s);

            // Convert price list
            List<PriceListResponse> priceReqs = new ArrayList<>();
            if (s.getPriceLists() != null && !s.getPriceLists().isEmpty()) {
                for (PriceList p : s.getPriceLists()) {
                    PriceListResponse res = new PriceListResponse();
                    res.setTime(p.getTime());
                    res.setPrice(p.getPrice());
                    priceReqs.add(res);
                }
            }

            // Convert administrative services
            List<CivilServiceResponse> serviceResponses = new ArrayList<>();
            List<CivilService> civilServices = s.getCivilServices();
            if (civilServices != null && !civilServices.isEmpty()) {
                for (CivilService civilService : civilServices) {
                    CivilServiceResponse response = new CivilServiceResponse();
                    response.setSampleCollectionMethods(civilService.getSampleCollectionMethods()); // ✅ Truyền Set
                    serviceResponses.add(response);
                }
            }


            // Build full response
            FullCivilServiceResponse fullResp = new FullCivilServiceResponse();
            fullResp.setServiceRequest(serviceReq);
            fullResp.setPriceListRequest(priceReqs);
            fullResp.setServiceResponses(serviceResponses);

            responses.add(fullResp);
        }

        return responses;
    }


    public ServiceTest deleteServiceTest(long serviceId) {
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));
        serviceTest.setActive(false);
        return serviceTestRepository.save(serviceTest);
    }

    public ServiceTest updateService(Long serviceId,
                                     ServiceRequest serviceRequest,
                                     PriceListRequest priceListRequest,
                                     AdministrativeServiceRequest administrativeServiceRequest,
                                     CivilServiceRequest civilServiceRequest,
                                     MultipartFile file) {

        ServiceTest existingService = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        // Kiểm tra nếu tên dịch vụ mới đã tồn tại ở service khác
        if (!existingService.getServiceName().equals(serviceRequest.getServiceName()) &&
                serviceTestRepository.existsByServiceName(serviceRequest.getServiceName())) {
            throw new AppException(ErrorCodeUser.SERVICE_NAME_IS_EXISTED);
        }

        // Cập nhật thông tin cơ bản
        existingService.setServiceName(serviceRequest.getServiceName());
        existingService.setDescription(serviceRequest.getDescription());
        existingService.setServiceType(serviceRequest.getServiceType());

        // Cập nhật ảnh nếu có
//        if (file != null && !file.isEmpty()) {
//            try {
//                String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
//                existingService.setImage(base64Image);
//            } catch (IOException e) {
//                throw new AppException(ErrorCodeUser.INTERNAL_ERROR);
//            }
//        }

        // Cập nhật PriceList mới
        if (priceListRequest != null) {
            PriceList priceList = priceListMapper.toPriceList(priceListRequest);
            priceList.setEffectiveDate(LocalDate.now());
            priceList.setService(existingService);
            List<PriceList> updatedPriceLists = new ArrayList<>(existingService.getPriceLists());
            updatedPriceLists.add(priceList);
            existingService.setPriceLists(updatedPriceLists);
        }

        // Cập nhật service con theo loại
        switch (serviceRequest.getServiceType()) {
            case ADMINISTRATIVE -> {
                if (administrativeServiceRequest == null) {
                    throw new AppException(ErrorCodeUser.INVALID_REQUEST);
                }
                AdministrativeService administrativeService =
                        administrativeServiceRepository.findByService(existingService)
                                .orElseGet(() -> new AdministrativeService());
                AdministrativeService updateAdministrativeService = administrativeMapper.toAdministrativeService(administrativeServiceRequest);
                updateAdministrativeService.setSampleCollectionMethod(SampleCollectionMethod.AT_CLINIC);
                updateAdministrativeService.setService(existingService);
                administrativeServiceRepository.save(updateAdministrativeService);
            }

            case CIVIL -> {
                if (civilServiceRequest == null) {
                    throw new AppException(ErrorCodeUser.INVALID_REQUEST);
                }
                CivilService civilService =
                        civilServiceRepository.findByService(existingService)
                                .orElseGet(() -> new CivilService());

                CivilService updateCivilService = civilServiceMapper.toCivilService(civilServiceRequest);
                updateCivilService.setService(existingService);
                civilServiceRepository.save(updateCivilService);
            }

            default -> throw new AppException(ErrorCodeUser.INVALID_REQUEST);
        }

        return serviceTestRepository.save(existingService);
    }


}
