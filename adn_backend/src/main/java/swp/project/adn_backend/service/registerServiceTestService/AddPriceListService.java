package swp.project.adn_backend.service.registerServiceTestService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.request.serviceRequest.AddPriceListRequest;
import swp.project.adn_backend.entity.PriceList;
import swp.project.adn_backend.entity.ServiceTest;
import swp.project.adn_backend.enums.ErrorCodeUser;
import swp.project.adn_backend.exception.AppException;
import swp.project.adn_backend.mapper.AddPriceListMapper;
import swp.project.adn_backend.repository.ServiceTestRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddPriceListService {
    AddPriceListMapper addPriceListMapper;
    ServiceTestRepository serviceTestRepository;

    @Autowired
    public AddPriceListService(AddPriceListMapper addPriceListMapper, ServiceTestRepository serviceTestRepository) {
        this.addPriceListMapper = addPriceListMapper;
        this.serviceTestRepository = serviceTestRepository;
    }

    public void addMorePriceList(AddPriceListRequest addPriceListRequest,
                                 long serviceId) {
        ServiceTest serviceTest = serviceTestRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCodeUser.SERVICE_NOT_EXISTS));

        PriceList newPriceList = addPriceListMapper.toAddPriceList(addPriceListRequest);
        List<PriceList> priceLists=serviceTest.getPriceLists();
        if(priceLists==null){
            priceLists=new ArrayList<>();
        }
        priceLists.add(newPriceList);
        serviceTest.setPriceLists(priceLists);
        newPriceList.setService(serviceTest);
        serviceTestRepository.save(serviceTest);
    }
}
