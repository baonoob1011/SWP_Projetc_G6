package swp.project.adn_backend.service;

import jakarta.servlet.http.HttpServletResponse;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import swp.project.adn_backend.entity.Result;
import swp.project.adn_backend.repository.ResultRepository;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JReportService {

    @Autowired
    private ResultRepository resultRepository;

    public void exportJasperReport(HttpServletResponse response) throws JRException, IOException {
        // 1. Lấy dữ liệu
        List<Result> address = resultRepository.findAll();

        // 2. Load JRXML từ đường dẫn tuyệt đối (chỉ dev/local)
        String absolutePath = "C:\\Users\\ACER\\Documents\\GitHub\\SWP_Projetc_G6\\adn_backend\\src\\main\\resources\\reports\\ADN_Result.jrxml";
        File jrxmlFile = new File(absolutePath);
        if (!jrxmlFile.exists()) {
            throw new FileNotFoundException("File ADN_Result.jrxml không tìm thấy tại " + absolutePath);
        }

        // 3. Compile báo cáo
        JasperReport jasperReport = JasperCompileManager.compileReport(jrxmlFile.getAbsolutePath());

        // 4. Tạo datasource và params
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(address);
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("createdBy", "Simplifying Tech");

        // 5. Fill và xuất PDF
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
        JasperExportManager.exportReportToPdfStream(jasperPrint, response.getOutputStream());
    }
}
