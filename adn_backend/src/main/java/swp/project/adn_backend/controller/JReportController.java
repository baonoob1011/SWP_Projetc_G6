package swp.project.adn_backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.project.adn_backend.entity.Result;
import swp.project.adn_backend.repository.ResultRepository;
import swp.project.adn_backend.service.JReportService;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
@RestController
@RequestMapping("/api/jasperpdf") // ✅ Thêm dòng này
public class JReportController {

    private ResultRepository repository;

    private JReportService service;

    @Autowired
    public JReportController(ResultRepository repository, JReportService service) {
        this.repository = repository;
        this.service = service;
    }

    @GetMapping("/getAddress")
    public List<Result> getAddress() {
        List<Result> address = (List<Result>) repository.findAll();
        return address;
    }


    @GetMapping("/export")
    public void createPDF(HttpServletResponse response) {
        try {
            response.setContentType("application/pdf");
            String currentDateTime = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
            response.setHeader("Content-Disposition", "attachment; filename=report_" + currentDateTime + ".pdf");

            service.exportJasperReport(response);

        } catch (Exception e) {
            try {
                response.reset(); // 🧹 Xoá Content-Type cũ
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.setContentType("application/json");

                // Tạo JSON string thủ công
                String json = String.format("{\"code\":1001,\"message\":\"%s\"}", e.getMessage());
                response.getWriter().write(json);
            } catch (IOException ioException) {
                ioException.printStackTrace();
            }
        }
    }

}
