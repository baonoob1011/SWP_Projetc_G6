package swp.project.adn_backend.service.payment;

import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.codec.binary.Hex;
import org.springframework.data.jpa.repository.support.QuerydslJpaRepository;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.configuration.VNPayConfig;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayService {


    public String createOrder(int total , String orderInfo, String txnRef, String urlReturn) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String orderType = "order-type";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);

        int amountInSmallestUnit = total * 100;
        vnp_Params.put("vnp_Amount", String.valueOf(amountInSmallestUnit));
        vnp_Params.put("vnp_TxnRef", txnRef);
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_OrderInfo", "Test order");
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", urlReturn);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        System.out.println("▶️ total = " + total);
        System.out.println("✅ vnp_Amount = " + amountInSmallestUnit);

        // Thời gian tạo & hết hạn
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Build query & hash
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String name = fieldNames.get(i);
            String value = vnp_Params.get(name);
            if (value != null && !value.isEmpty()) {
                // ❌ Không encode ở hashData
                hashData.append(name).append('=').append(value);

                // ✅ Encode ở query string
                query.append(URLEncoder.encode(name, StandardCharsets.US_ASCII))
                        .append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));

                if (i < fieldNames.size() - 1) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }


        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        System.out.println("🔐 hashData = " + hashData);
        System.out.println("🔐 vnp_SecureHash = " + vnp_SecureHash);

        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + query.toString();
        System.out.println("🧾 Final Payment URL: " + paymentUrl);
        return paymentUrl;
    }


    public int orderReturn(HttpServletRequest request){
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        String signValue = VNPayConfig.hashAllFields(fields); // Phải KHÔNG encode value
        System.out.println("✅ Re-calculated hash: " + signValue);
        System.out.println("✅ Received hash: " + vnp_SecureHash);
        System.out.println("✅ Transaction status: " + request.getParameter("vnp_TransactionStatus"));

        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }

    }


    public boolean validateVNPaySignature(Map<String, String> params, String secureHash) {
        String secretKey = VNPayConfig.vnp_HashSecret; // ✅ lấy từ config

        Map<String, String> sortedParams = new TreeMap<>(params);
        sortedParams.remove("vnp_SecureHash");

        StringBuilder data = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            data.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }
        if (data.length() > 0) {
            data.setLength(data.length() - 1); // Xoá dấu &
        }

        String hash = hmacSHA512(secretKey, data.toString());
        return hash.equalsIgnoreCase(secureHash);
    }


    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKeySpec);
            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Hex.encodeHexString(bytes);
        } catch (Exception e) {
            throw new RuntimeException("HMAC error", e);
        }
    }

}
