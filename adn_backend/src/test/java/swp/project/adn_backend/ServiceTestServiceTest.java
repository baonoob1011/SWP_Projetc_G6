package swp.project.adn_backend;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import swp.project.adn_backend.dto.request.serviceRequest.PriceListRequest;
import swp.project.adn_backend.dto.request.serviceRequest.ServiceRequest;
import swp.project.adn_backend.dto.request.updateRequest.UpdateServiceTestRequest;
import swp.project.adn_backend.dto.response.discount.DiscountResponse;
import swp.project.adn_backend.dto.response.serviceResponse.*;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.enums.SampleCollectionMethod;
import swp.project.adn_backend.enums.ServiceType;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.PriceListMapper;
import swp.project.adn_backend.mapper.ServiceTestMapper;
import swp.project.adn_backend.repository.AdministrativeServiceRepository;
import swp.project.adn_backend.repository.CivilServiceRepository;
import swp.project.adn_backend.repository.KitRepository;
import swp.project.adn_backend.repository.ServiceTestRepository;
import swp.project.adn_backend.service.registerServiceTestService.ServiceTestService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@ExtendWith(MockitoExtension.class)
public class ServiceTestServiceTest {

    @InjectMocks
    private ServiceTestService serviceTestService; // Class chứa phương thức createService

    @Mock
    private ServiceTestRepository serviceTestRepository;

    @Mock
    private KitRepository kitRepository;

    @Mock
    private AdministrativeServiceRepository administrativeServiceRepository;

    @Mock
    private CivilServiceRepository civilServiceRepository;

    @Mock
    private PriceListMapper priceListMapper;

    @Mock
    private ServiceTestMapper serviceTestMapper;

    @Test
    public void testCreateService_Success_Civil() throws IOException {
        // 1️⃣ Mock input
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("Xét nghiệm cha con");
        serviceRequest.setServiceType(ServiceType.CIVIL);

        PriceListRequest priceListRequest = new PriceListRequest();
        priceListRequest.setPrice(1000000.0);
        priceListRequest.setTime("2");

        long kitId = 1L;
        MultipartFile file = new MockMultipartFile("file", "image.jpg", "image/jpeg", "imagecontent".getBytes());

        // 2️⃣ Mock kit
        Kit kit = new Kit();
        kit.setKitId(kitId);

        when(kitRepository.findById(kitId)).thenReturn(Optional.of(kit));
        when(serviceTestRepository.existsByServiceName(serviceRequest.getServiceName())).thenReturn(false);

        // 3️⃣ Mock mapping
        ServiceTest mappedService = new ServiceTest();
        mappedService.setServiceName(serviceRequest.getServiceName());
        mappedService.setServiceType(ServiceType.CIVIL);
        mappedService.setPriceLists(new ArrayList<>());

        when(serviceTestMapper.toServiceTest(serviceRequest)).thenReturn(mappedService);

        PriceList mappedPriceList = new PriceList();
        mappedPriceList.setPrice(priceListRequest.getPrice());
        when(priceListMapper.toPriceList(priceListRequest)).thenReturn(mappedPriceList);

        // 4️⃣ Mock save
        when(serviceTestRepository.save(any(ServiceTest.class))).thenReturn(mappedService);

        // 5️⃣ Gọi hàm
        ServiceTest result = serviceTestService.createService(serviceRequest, priceListRequest, kitId, file);

        // ✅ Assert
        Assertions.assertNotNull(result);
        assertEquals("Xét nghiệm cha con", result.getServiceName());
        assertEquals(ServiceType.CIVIL, result.getServiceType());

        // ✅ Verify các hàm liên quan đã được gọi
        Mockito.verify(serviceTestRepository).save(any(ServiceTest.class));
        Mockito.verify(civilServiceRepository).save(any(CivilService.class));
    }

    @Test
    void testGetAllService_Success() {
        // 1️⃣ Prepare mock data
        ServiceTest serviceTest = new ServiceTest();
        serviceTest.setServiceId(1L);
        serviceTest.setServiceName("Test Service");

        PriceList price1 = new PriceList();
        price1.setPriceId(101L);
        price1.setPrice(100000.0);
        price1.setTime("2h");

        serviceTest.setPriceLists(List.of(price1));

        GetAllServiceResponse mockServiceResponse = new GetAllServiceResponse();
        mockServiceResponse.setServiceId(1L);
        mockServiceResponse.setServiceName("Test Service");

        PriceListResponse priceListResponse = new PriceListResponse();
        priceListResponse.setPriceId(101L);
        priceListResponse.setPrice(100000.0);
        priceListResponse.setTime("2h");

        // 2️⃣ Mock behavior
        when(serviceTestRepository.findAll()).thenReturn(List.of(serviceTest));
        when(serviceTestMapper.toGetAllServiceTestResponse(serviceTest)).thenReturn(mockServiceResponse);
        when(priceListMapper.toPriceListResponse(price1)).thenReturn(priceListResponse);

        // 3️⃣ Call method
        List<FullServiceTestResponse> result = serviceTestService.getAllService();

        // 4️⃣ Assertions
        Assertions.assertNotNull(result);
        assertEquals(1, result.size());

        FullServiceTestResponse response = result.get(0);
        assertEquals("Test Service", response.getServiceRequest().getServiceName());
        assertEquals(1, response.getPriceListRequest().size());
        assertEquals(100000.0, response.getPriceListRequest().get(0).getPrice());

        // 5️⃣ Verify interactions
        Mockito.verify(serviceTestRepository).findAll();
        Mockito.verify(serviceTestMapper).toGetAllServiceTestResponse(serviceTest);
        Mockito.verify(priceListMapper).toPriceListResponse(price1);
    }

    @Test
    void testGetAdministrativeServices_Success() {
        // 1️⃣ Mock ServiceTest
        ServiceTest service = new ServiceTest();
        service.setServiceId(1L);
        service.setServiceType(ServiceType.ADMINISTRATIVE);
        service.setPriceLists(List.of(createMockPriceList(200000.0)));
        service.setDiscounts(List.of(createMockDiscount(true, 20)));
        service.setAdministrativeService(List.of(createMockAdministrativeService()));

        List<ServiceTest> services = List.of(service);
        when(serviceTestRepository.findAllByServiceType(ServiceType.ADMINISTRATIVE)).thenReturn(services);
        when(serviceTestMapper.toServiceTestResponse(service)).thenReturn(new ServiceTestResponse());
        when(serviceTestMapper.toDiscountResponses(service.getDiscounts()))
                .thenReturn(List.of(new DiscountResponse()));

        // 2️⃣ Gọi hàm
        List<FullAdministrationServiceResponse> result = serviceTestService.getAdministrativeServices();

        // 3️⃣ Kiểm tra kết quả
        assertEquals(1, result.size());
        assertNotNull(result.get(0).getPriceListRequest());
        assertNotNull(result.get(0).getAdministrativeServiceRequest());
        assertEquals(160000.0, result.get(0).getPriceListRequest().get(0).getPrice()); // Giảm 20%
    }

    private PriceList createMockPriceList(double price) {
        PriceList priceList = new PriceList();
        priceList.setPrice(price);
        priceList.setTime("3");
        return priceList;
    }

    private Discount createMockDiscount(boolean active, double discountValue) {
        Discount discount = new Discount();
        discount.setActive(active);
        discount.setDiscountValue(discountValue);
        return discount;
    }

    private AdministrativeService createMockAdministrativeService() {
        AdministrativeService a = new AdministrativeService();
        a.setSampleCollectionMethod(SampleCollectionMethod.AT_CLINIC);
        return a;
    }

    @Test
    void testGetCivilServices_Success() {
        // 1️⃣ Mock ServiceTest
        ServiceTest service = new ServiceTest();
        service.setServiceId(2L);
        service.setServiceType(ServiceType.CIVIL);
        service.setPriceLists(List.of(createMockPriceList(300000.0)));
        service.setDiscounts(List.of(createMockDiscount(true, 10)));
        service.setCivilServices(List.of(createMockCivilService()));

        List<ServiceTest> services = List.of(service);
        when(serviceTestRepository.findAllByServiceType(ServiceType.CIVIL)).thenReturn(services);
        when(serviceTestMapper.toServiceTestResponse(service)).thenReturn(new ServiceTestResponse());
        when(serviceTestMapper.toDiscountResponses(service.getDiscounts()))
                .thenReturn(List.of(new DiscountResponse()));

        // 2️⃣ Gọi hàm
        List<FullCivilServiceResponse> result = serviceTestService.getCivilServices();

        // 3️⃣ Kiểm tra kết quả
        assertEquals(1, result.size());
        assertNotNull(result.get(0).getPriceListRequest());
        assertNotNull(result.get(0).getServiceResponses());
        assertEquals(270000.0, result.get(0).getPriceListRequest().get(0).getPrice()); // Giảm 10%
    }

    private CivilService createMockCivilService() {
        CivilService civilService = new CivilService();
        Set<SampleCollectionMethod> methods = new HashSet<>();
        methods.add(SampleCollectionMethod.AT_CLINIC);
        methods.add(SampleCollectionMethod.AT_HOME);
        civilService.setSampleCollectionMethods(methods);
        return civilService;
    }
    @Test
    void testDeleteServiceTest_Success() {
        long serviceId = 1L;
        ServiceTest serviceTest = new ServiceTest();
        serviceTest.setServiceId(serviceId);

        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(serviceTest));

        serviceTestService.deleteServiceTest(serviceId);

        verify(serviceTestRepository).delete(serviceTest);
    }

    @Test
    void testDeleteServiceTest_ServiceNotFound() {
        long serviceId = 1L;
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class,
                () -> serviceTestService.deleteServiceTest(serviceId));
        assertEquals(ErrorCodeUser.SERVICE_NOT_EXISTS, exception.getErrorCode());
    }
    @Test
    void testUpdateService_Success() throws IOException {
        long serviceId = 1L;

        // 1. Setup input
        UpdateServiceTestRequest updateRequest = new UpdateServiceTestRequest();
        updateRequest.setServiceName("New Service");
        updateRequest.setDescription("Updated Description");
        updateRequest.setServiceType(ServiceType.CIVIL);

        PriceListRequest priceListRequest = new PriceListRequest();
        priceListRequest.setTime("3 ngày");
        priceListRequest.setPrice(1500000.0);
        priceListRequest.setEffectiveDate(LocalDate.now());

        MultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fakeimagecontent".getBytes());

        // 2. Setup existing service
        PriceList existingPrice = new PriceList();
        existingPrice.setPrice(1200000.0);
        existingPrice.setTime("2 ngày");

        ServiceTest existingService = new ServiceTest();
        existingService.setServiceId(serviceId);
        existingService.setServiceName("Old Service");
        existingService.setDescription("Old Description");
        existingService.setServiceType(ServiceType.CIVIL);
        existingService.setPriceLists(new ArrayList<>(List.of(existingPrice)));

        // 3. Mocks
        when(serviceTestRepository.findById(serviceId)).thenReturn(Optional.of(existingService));
        when(serviceTestRepository.existsByServiceName("New Service")).thenReturn(false);
        when(civilServiceRepository.findByService(existingService)).thenReturn(Optional.empty());
        when(serviceTestRepository.save(any(ServiceTest.class))).thenReturn(existingService); // ⬅ CHỖ QUAN TRỌNG

        // 4. Gọi hàm
        ServiceTest result = serviceTestService.updateService(
                serviceId,
                updateRequest,
                null,
                priceListRequest,
                file
        );

        // 5. Kiểm tra kết quả
        assertNotNull(result); // ✅ Fix lỗi bạn gặp
        assertEquals("New Service", result.getServiceName());
        assertEquals("Updated Description", result.getDescription());

        verify(serviceTestRepository).save(any(ServiceTest.class));
    }

}
