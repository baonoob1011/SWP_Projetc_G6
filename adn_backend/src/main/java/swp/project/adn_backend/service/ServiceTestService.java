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
import swp.project.adn_backend.dto.response.serviceResponse.ServiceResponse;
import swp.project.adn_backend.dto.test.AdministrativeServiceResponse;
import swp.project.adn_backend.dto.test.FullServiceResponse;
import swp.project.adn_backend.dto.test.PriceListResponse;
import swp.project.adn_backend.dto.test.ServiceTestResponse;
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
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;


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

    @Autowired
    public ServiceTestService(UserRepository userRepository, ServiceTestMapper serviceTestMapper, ServiceTestRepository serviceTestRepository, PriceListMapper priceListMapper, FeedbackMapper feedbackMapper, AdministrativeMapper administrativeMapper, CivilServiceMapper civilServiceMapper, AdministrativeServiceRepository administrativeServiceRepository, CivilServiceRepository civilServiceRepository, PriceListRepository priceListRepository, EntityManager entityManager) {
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
                if (administrativeServiceRequest == null) {
                    throw new AppException(ErrorCodeUser.INVALID_REQUEST);
                }
                AdministrativeService administrativeService = administrativeMapper.toAdministrativeService(administrativeServiceRequest);
                if (administrativeService == null) {
                    throw new AppException(ErrorCodeUser.INTERNAL_ERROR);
                }
                administrativeService.setSampleCollectionMethod(SampleCollectionMethod.AT_CLINIC);
                administrativeService.setService(serviceTest);
                administrativeServiceRepository.save(administrativeService);
            }

            case CIVIL -> {
                if (civilServiceRequest == null) {
                    throw new AppException(ErrorCodeUser.INVALID_REQUEST);
                }
                CivilService civilService = civilServiceMapper.toCivilService(civilServiceRequest);
                if (civilService == null) {
                    throw new AppException(ErrorCodeUser.INTERNAL_ERROR);
                }
                civilService.setService(serviceTest);
                civilServiceRepository.save(civilService);
            }

            default -> throw new AppException(ErrorCodeUser.INVALID_REQUEST);
        }

        return serviceTestRepository.save(serviceTest);
    }

    public List<ServiceResponse> getAllService() {
        List<ServiceTest> serviceTests = serviceTestRepository.findAll();
        return serviceTestMapper.toServiceList(serviceTests);  // <-- dùng toServiceList
    }

//    @Transactional(readOnly = true)
//    public List<ServiceResponse> getAdministrativeService() {
//        List<ServiceTest> serviceTests = serviceTestRepository.findAllByServiceType(ServiceType.ADMINISTRATIVE);
//    }
public List<FullServiceResponse> getAdministrativeServices() {
    List<ServiceTest> services = serviceTestRepository.findAllByServiceType(ServiceType.ADMINISTRATIVE);

    List<FullServiceResponse> responses = new ArrayList<>();

    for (ServiceTest s : services) {
        ServiceTestResponse serviceReq = new ServiceTestResponse();
        serviceReq.setServiceName(s.getServiceName());
        serviceReq.setDescription(s.getDescription());
        serviceReq.setServiceType(s.getServiceType());
        serviceReq.setImage(s.getImage());

        PriceListResponse priceReq = null;
        if (s.getPriceLists() != null && !s.getPriceLists().isEmpty()) {
            PriceList p = s.getPriceLists().get(0); // hoặc logic chọn giá phù hợp
            priceReq = new PriceListResponse();
            priceReq.setTime(p.getTime());
            priceReq.setPrice(p.getPrice());
        }
        AdministrativeServiceResponse administrativeServiceRequest = null;

        if (s.getAdministrativeService() != null && !s.getAdministrativeService().isEmpty()) {
            AdministrativeService administrativeService = s.getAdministrativeService().get(0); // ✅ Lấy phần tử đầu tiên
            administrativeServiceRequest = new AdministrativeServiceResponse();
            administrativeServiceRequest.setSampleCollectionMethod(administrativeService.getSampleCollectionMethod());
        }

        FullServiceResponse fullResp = new FullServiceResponse();
        fullResp.setServiceRequest(serviceReq);
        fullResp.setPriceListRequest(priceReq);
        fullResp.setAdministrativeServiceRequest(administrativeServiceRequest);
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
