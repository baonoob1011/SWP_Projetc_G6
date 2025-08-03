package swp.project.adn_backend.service.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.project.adn_backend.dto.response.DashboardResponse;
import swp.project.adn_backend.dto.response.DailyRevenueResponse;
import swp.project.adn_backend.dto.response.YearlyRevenueResponse;
import swp.project.adn_backend.dto.response.ServiceRatingStatsResponse;
import swp.project.adn_backend.dto.response.AppointmentStatusPercentageResponse;
import swp.project.adn_backend.dto.response.YearlyRevenueSummaryResponse;
import swp.project.adn_backend.dto.response.SystemTransactionHistoryResponse;
import swp.project.adn_backend.repository.*;
import swp.project.adn_backend.entity.*;
import swp.project.adn_backend.enums.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final FeedbackRepository feedbackRepository;
    private final ServiceTestRepository serviceTestRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final ManagerRepository managerRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final InvoiceRepository invoiceRepository;



    @Autowired
    public DashboardService(UserRepository userRepository, PaymentRepository paymentRepository,
                          FeedbackRepository feedbackRepository, ServiceTestRepository serviceTestRepository,
                          AppointmentRepository appointmentRepository, PatientRepository patientRepository, StaffRepository staffRepository, ManagerRepository managerRepository,
                          WalletTransactionRepository walletTransactionRepository, InvoiceRepository invoiceRepository) {
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.feedbackRepository = feedbackRepository;
        this.serviceTestRepository = serviceTestRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.managerRepository = managerRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.invoiceRepository = invoiceRepository;
    }
    
    
    public DashboardResponse getDashboardStats() {
        long totalUsers = userRepository.count() - userRepository.countUsersByAdminRole()-staffRepository.countUsersByStaffRole()-managerRepository.count();
        long activeUsers = userRepository.countActiveUsers() - userRepository.countUsersByAdminRole()-staffRepository.countUsersByStaffRole()-managerRepository.count();
        long inactiveUsers = userRepository.countInactiveUsers();
        long totalPatients = patientRepository.count();
        long totalStaff = staffRepository.countUsersByStaffRole();
        long totalManagers = managerRepository.count();
        long totalAdmins = userRepository.countUsersByAdminRole();
        long totalUsersRegisteredService = appointmentRepository.countDistinctUsersRegisteredService();
        
        DashboardResponse response = new DashboardResponse(
            totalUsers,
            activeUsers,
            inactiveUsers,
            totalPatients,
            totalStaff,
            totalManagers,
            totalAdmins
        );
        response.setTotalUsersRegisteredService(totalUsersRegisteredService);
        return response;
    }

    /**
     * Lấy thống kê đánh giá theo từng service
     */
    public ServiceRatingStatsResponse getServiceRatingStats() {
        List<Object[]> rawStats = feedbackRepository.getServiceRatingStats();
        List<ServiceRatingStatsResponse.ServiceRatingInfo> serviceRatings = new ArrayList<>();
        
        double totalRating = 0.0;
        long totalFeedbacks = 0;
        
        for (Object[] row : rawStats) {
            Long serviceId = (Long) row[0];
            String serviceName = (String) row[1];
            Double avgRating = (Double) row[2];
            Long feedbackCount = (Long) row[3];
            String serviceType = row[4] != null ? row[4].toString() : "UNKNOWN";
            
            // Xử lý trường hợp service không có feedback
            if (avgRating == null) {
                avgRating = 0.0;
            }
            if (feedbackCount == null) {
                feedbackCount = 0L;
            }
            
            ServiceRatingStatsResponse.ServiceRatingInfo serviceInfo = 
                new ServiceRatingStatsResponse.ServiceRatingInfo(
                    serviceId, serviceName, avgRating, feedbackCount, serviceType
                );
            serviceRatings.add(serviceInfo);
            
            totalRating += avgRating * feedbackCount;
            totalFeedbacks += feedbackCount;
        }
        
        // Tính đánh giá trung bình tổng thể
        double overallAverageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0.0;
        long totalServices = serviceTestRepository.count();
        
        return new ServiceRatingStatsResponse(
            serviceRatings,
            overallAverageRating,
            totalServices,
            totalFeedbacks,
            "Thống kê đánh giá theo từng dịch vụ"
        );
    }

    public Long getTotalRevenue(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            Double totalRevenue = paymentRepository.sumSuccessfulAmountBetween(startDate, endDate);
            return totalRevenue != null ? totalRevenue.longValue() : 0L;
        }
        Double totalRevenue = paymentRepository.sumSuccessfulAmount();
        return totalRevenue != null ? totalRevenue.longValue() : 0L;
    }
    
    public DailyRevenueResponse getDailyRevenue(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = paymentRepository.findDailyRevenueBetween(startDate, endDate);
        Map<LocalDate, Long> revenueMap = new HashMap<>();
        long totalRevenue = 0L;

        // Đưa dữ liệu từ DB vào map để tra cứu nhanh
        for (Object[] result : results) {
            java.sql.Date sqlDate = (java.sql.Date) result[0];
            LocalDate date = sqlDate.toLocalDate();
            Double revenue = (Double) result[1];
            Long revenueLong = revenue != null ? revenue.longValue() : 0L;
            revenueMap.put(date, revenueLong);
            totalRevenue += revenueLong;
        }

        // Tạo list đủ ngày, ngày nào không có thì revenue = 0
        List<Map<String, Object>> dailyRevenues = new ArrayList<>();
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            Map<String, Object> dayRevenue = new HashMap<>();
            dayRevenue.put("date", current);
            dayRevenue.put("revenue", revenueMap.getOrDefault(current, 0L));
            dailyRevenues.add(dayRevenue);
            current = current.plusDays(1);
        }

        return new DailyRevenueResponse(dailyRevenues, totalRevenue, "Doanh thu hàng ngày từ " + startDate + " đến " + endDate);
    }

    public YearlyRevenueResponse getYearlyRevenue(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = paymentRepository.findYearlyRevenueBetween(startDate, endDate);
        Map<Integer, Long> revenueMap = new HashMap<>();
        long totalRevenue = 0L;

        // Đưa dữ liệu từ DB vào map để tra cứu nhanh
        for (Object[] result : results) {
            Integer year = (Integer) result[0];
            Double revenue = (Double) result[1];
            Long revenueLong = revenue != null ? revenue.longValue() : 0L;
            revenueMap.put(year, revenueLong);
            totalRevenue += revenueLong;
        }

        // Tạo list đủ năm, năm nào không có thì revenue = 0
        List<Map<String, Object>> yearlyRevenues = new ArrayList<>();
        int startYear = startDate.getYear();
        int endYear = endDate.getYear();

        for (int year = startYear; year <= endYear; year++) {
            Map<String, Object> yearRevenue = new HashMap<>();
            yearRevenue.put("year", year);
            yearRevenue.put("revenue", revenueMap.getOrDefault(year, 0L));
            yearlyRevenues.add(yearRevenue);
        }

        return new YearlyRevenueResponse(yearlyRevenues, totalRevenue, "Doanh thu theo năm từ " + startDate + " đến " + endDate);
    }

    public AppointmentStatusPercentageResponse getAppointmentStatusPercentage() {
        long totalCompleted = appointmentRepository.countCompletedAppointments();
        long totalCancelled = appointmentRepository.countCancelledAppointments();
        long totalPending = appointmentRepository.countPendingAppointments();
        long totalConfirmed = appointmentRepository.countConfirmedAppointments();
        long totalRated = appointmentRepository.countRatedAppointments();
        
        long totalAppointments = totalCompleted + totalCancelled + totalPending + totalConfirmed + totalRated;
        
        double completedPercentage = totalAppointments > 0 ? 
            (double) totalCompleted / totalAppointments * 100 : 0.0;
        double cancelledPercentage = totalAppointments > 0 ? 
            (double) totalCancelled / totalAppointments * 100 : 0.0;
        
        return AppointmentStatusPercentageResponse.builder()
                .totalCompleted(totalCompleted)
                .totalCancelled(totalCancelled)
                .totalAppointments(totalAppointments)
                .completedPercentage(Math.round(completedPercentage * 100.0) / 100.0)
                .cancelledPercentage(Math.round(cancelledPercentage * 100.0) / 100.0)
                .build();
    }

    public YearlyRevenueSummaryResponse getYearlyRevenueSummary(int year) {
        int currentYear = java.time.LocalDate.now().getYear();
        int lastMonth = (year == currentYear) ? java.time.LocalDate.now().getMonthValue() : 12;
        List<YearlyRevenueSummaryResponse.MonthlyRevenue> monthlyRevenues = new ArrayList<>();
        long total = 0L;
        for (int month = 1; month <= lastMonth; month++) {
            java.time.LocalDate start = java.time.LocalDate.of(year, month, 1);
            java.time.LocalDate end = java.time.YearMonth.of(year, month).atEndOfMonth();
            Double revenue = paymentRepository.sumSuccessfulAmountBetween(start, end);
            Long revenueLong = revenue != null ? revenue.longValue() : 0L;
            monthlyRevenues.add(new YearlyRevenueSummaryResponse.MonthlyRevenue(month, revenueLong));
            total += revenueLong;
        }
        return new YearlyRevenueSummaryResponse(year, monthlyRevenues, total);
    }

    /**
     * Lấy lịch sử giao dịch tiền vào và tiền ra của hệ thống
     */
    public SystemTransactionHistoryResponse getSystemTransactionHistory(LocalDate startDate, LocalDate endDate, Long userId) {
        List<SystemTransactionHistoryResponse.TransactionRecord> transactions = new ArrayList<>();
        long totalIncome = 0L;
        long totalExpense = 0L;

        // Lấy tất cả payments (tiền vào từ thanh toán dịch vụ)
        List<Payment> payments = paymentRepository.findAll();
        
        for (Payment payment : payments) {
            // Filter theo userId nếu có
            if (userId != null && (payment.getUsers() == null || payment.getUsers().getUserId() != userId)) {
                continue;
            }
            
            if (payment.getTransitionDate() != null && 
                (startDate == null || !payment.getTransitionDate().isBefore(startDate)) &&
                (endDate == null || !payment.getTransitionDate().isAfter(endDate))) {
                
                if (payment.getGetPaymentStatus() == PaymentStatus.PAID) {
                    // Tiền vào từ thanh toán thành công
                    String serviceName = "Không xác định";
                    String appointmentDate = "Không có";
                    String appointmentType = "Không có";
                    
                    if (payment.getAppointment() != null) {
                        if (payment.getAppointment().getServices() != null) {
                            serviceName = payment.getAppointment().getServices().getServiceName();
                        }
                        if (payment.getAppointment().getAppointmentDate() != null) {
                            appointmentDate = payment.getAppointment().getAppointmentDate().toString();
                        }
                        if (payment.getAppointment().getAppointmentType() != null) {
                            appointmentType = payment.getAppointment().getAppointmentType().toString();
                        }
                    }
                    
                    SystemTransactionHistoryResponse.TransactionRecord record = SystemTransactionHistoryResponse.TransactionRecord.builder()
                            .transactionId(payment.getPaymentId())
                            .transactionType("INCOME")
                            .category("PAYMENT")
                            .amount((long) payment.getAmount())
                            .currency("VND")
                            .description("Thanh toán dịch vụ: " + serviceName + " (" + appointmentType + ")")
                            .userName(payment.getUsers() != null ? payment.getUsers().getFullName() : "Không xác định")
                            .userEmail(payment.getUsers() != null ? payment.getUsers().getEmail() : "Không xác định")
                            .userPhone(payment.getUsers() != null ? payment.getUsers().getPhone() : "Không có")
                            .timestamp(payment.getTransitionDate().atStartOfDay())
                            .status(payment.getGetPaymentStatus().toString())
                            .paymentMethod(payment.getPaymentMethod().toString())
                            .appointmentInfo(payment.getAppointment() != null ? 
                                    "Lịch hẹn #" + payment.getAppointment().getAppointmentId() + 
                                    " - Ngày: " + appointmentDate + 
                                    " - Dịch vụ: " + serviceName : "Không có")
                            .serviceName(serviceName)
                            .serviceId(payment.getAppointment() != null && payment.getAppointment().getServices() != null ? 
                                    payment.getAppointment().getServices().getServiceId() : null)
                            .appointmentId(payment.getAppointment() != null ? payment.getAppointment().getAppointmentId() : null)
                            .appointmentDate(appointmentDate)
                            .appointmentType(appointmentType)
                            .createdBy(payment.getUsers() != null ? payment.getUsers().getFullName() : "Không xác định")
                            .note(payment.getAppointment() != null ? payment.getAppointment().getNote() : null)
                            .refTransactionId(null) // Không cần cho Payment từ Payment entity
                            .walletBalanceAfter(null) // Không phải giao dịch ví
                            .build();
                    
                    transactions.add(record);
                    totalIncome += (long) payment.getAmount();
                }
                // Bỏ phần xử lý REFUNDED từ Payment để tránh duplicate
                // Hoàn tiền sẽ được xử lý từ WalletTransaction
            }
        }

        // Lấy tất cả wallet transactions (nạp tiền và rút tiền từ ví)
        List<WalletTransaction> walletTransactions = walletTransactionRepository.findAll();
        
        for (WalletTransaction walletTransaction : walletTransactions) {
            // Filter theo userId nếu có
            if (userId != null && (walletTransaction.getWallet() == null || 
                walletTransaction.getWallet().getUser() == null || 
                walletTransaction.getWallet().getUser().getUserId() != userId)) {
                continue;
            }
            
            if (walletTransaction.getTimestamp() != null && 
                (startDate == null || !walletTransaction.getTimestamp().toLocalDate().isBefore(startDate)) &&
                (endDate == null || !walletTransaction.getTimestamp().toLocalDate().isAfter(endDate))) {
                
                if (walletTransaction.getType() == TransactionType.DEPOSIT) {
                    // Tiền vào từ nạp ví (không tính vào doanh thu hệ thống, chỉ để theo dõi)
                    
                    // Tính số dư sau giao dịch: số dư hiện tại - số tiền nạp (vì nạp tiền làm tăng số dư)
                    Long walletBalanceAfter = walletTransaction.getWallet().getBalance() - walletTransaction.getAmount();
                    
                    SystemTransactionHistoryResponse.TransactionRecord record = SystemTransactionHistoryResponse.TransactionRecord.builder()
                            .transactionId(walletTransaction.getWalletTransactionId())
                            .transactionType("INCOME")
                            .category("DEPOSIT")
                            .amount(walletTransaction.getAmount())
                            .currency("VND")
                            .description("Nạp tiền vào ví")
                            .userName(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getFullName() : "Không xác định")
                            .userEmail(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getEmail() : "Không xác định")
                            .userPhone(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getPhone() : "Không có")
                            .timestamp(walletTransaction.getTimestamp())
                            .status(walletTransaction.getTransactionStatus().toString())
                            .paymentMethod("VN_PAY")
                            .appointmentInfo("Nạp ví")
                            .serviceName("Nạp ví")
                            .serviceId(null)
                            .appointmentId(null)
                            .appointmentDate(null)
                            .appointmentType(null)
                            .createdBy(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getFullName() : "Không xác định")
                            .note("Nạp tiền vào ví qua VNPay")
                            .refTransactionId(null) // Không cần cho DEPOSIT
                            .walletBalanceAfter(walletBalanceAfter) // Số dư ví sau giao dịch (đã cộng tiền nạp)
                            .build();
                    
                    transactions.add(record);
                    // Không tính nạp ví vào doanh thu hệ thống
                } else if (walletTransaction.getType() == TransactionType.REFUND) {
                    // Tiền ra từ hoàn tiền ví - đây là nơi duy nhất xử lý hoàn tiền
                    
                    // Tính số dư sau giao dịch hoàn tiền:
                    // Ví dụ: Ban đầu 500k -> Thanh toán 10k = 490k -> Hoàn tiền 10k = 500k
                    // wallet.getBalance() = 500k (số dư hiện tại sau khi đã hoàn tiền)
                    Long walletBalanceAfter = walletTransaction.getWallet().getBalance();
                    
                    // Tìm giao dịch thanh toán gốc để lấy refTransactionId và thông tin dịch vụ
                    Long refTransactionId = null;
                    String serviceName = "Hoàn tiền dịch vụ";
                    Long serviceId = null;
                    Long appointmentId = null;
                    String appointmentDate = null;
                    String appointmentType = null;
                    String appointmentInfo = "Hoàn tiền ví";
                    
                    if (walletTransaction.getWallet() != null && walletTransaction.getWallet().getUser() != null) {
                        // Tìm wallet transaction PAYMENT có cùng số tiền và user (giao dịch thanh toán gốc)
                        List<WalletTransaction> allWalletTransactions = walletTransactionRepository.findAll();
                        for (WalletTransaction wt : allWalletTransactions) {
                            if (wt.getType() == TransactionType.PAYMENT &&
                                wt.getWallet() != null && 
                                wt.getWallet().getUser() != null &&
                                wt.getWallet().getUser().getUserId() == walletTransaction.getWallet().getUser().getUserId() &&
                                wt.getAmount() == walletTransaction.getAmount() &&
                                wt.getWalletTransactionId() != walletTransaction.getWalletTransactionId()) { // Không phải chính nó
                                refTransactionId = wt.getWalletTransactionId();
                                
                                // Lấy thông tin dịch vụ từ appointment liên quan đến giao dịch thanh toán gốc
                                if (wt.getWallet() != null && wt.getWallet().getUser() != null) {
                                    List<Appointment> userAppointments = appointmentRepository.findByUsers_UserId(wt.getWallet().getUser().getUserId());
                                    if (!userAppointments.isEmpty()) {
                                        Appointment latestAppointment = userAppointments.get(0);
                                        if (latestAppointment.getServices() != null) {
                                            serviceName = latestAppointment.getServices().getServiceName();
                                            serviceId = latestAppointment.getServices().getServiceId();
                                        }
                                        if (latestAppointment.getAppointmentDate() != null) {
                                            appointmentDate = latestAppointment.getAppointmentDate().toString();
                                        }
                                        if (latestAppointment.getAppointmentType() != null) {
                                            appointmentType = latestAppointment.getAppointmentType().toString();
                                        }
                                        appointmentId = latestAppointment.getAppointmentId();
                                        appointmentInfo = "Hoàn tiền lịch hẹn #" + latestAppointment.getAppointmentId() + 
                                                        " - Ngày: " + appointmentDate + 
                                                        " - Dịch vụ: " + serviceName;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    
                    SystemTransactionHistoryResponse.TransactionRecord record = SystemTransactionHistoryResponse.TransactionRecord.builder()
                            .transactionId(walletTransaction.getWalletTransactionId())
                            .transactionType("EXPENSE")
                            .category("REFUND")
                            .amount(walletTransaction.getAmount())
                            .currency("VND")
                            .description("Hoàn tiền dịch vụ: " + serviceName)
                            .userName(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getFullName() : "Không xác định")
                            .userEmail(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getEmail() : "Không xác định")
                            .userPhone(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getPhone() : "Không có")
                            .timestamp(walletTransaction.getTimestamp())
                            .status(walletTransaction.getTransactionStatus().toString())
                            .paymentMethod("WALLET")
                            .appointmentInfo(appointmentInfo)
                            .serviceName(serviceName)
                            .serviceId(serviceId)
                            .appointmentId(appointmentId)
                            .appointmentDate(appointmentDate)
                            .appointmentType(appointmentType)
                            .createdBy("Manager (Hệ thống)")
                            .note("Hoàn tiền dịch vụ về ví")
                            .refTransactionId(refTransactionId) // ID giao dịch thanh toán gốc
                            .walletBalanceAfter(walletBalanceAfter) // Số dư ví sau giao dịch (đã bao gồm tiền hoàn)
                            .build();
                    
                    transactions.add(record);
                    totalExpense += walletTransaction.getAmount();
                } else if (walletTransaction.getType() == TransactionType.PAYMENT) {
                    // Tiền vào từ thanh toán bằng ví - tính vào doanh thu hệ thống
                    String serviceName = "Không xác định";
                    String appointmentDate = "Không có";
                    String appointmentType = "Không có";
                    String appointmentInfo = "Thanh toán ví";
                    Long serviceId = null;
                    Long appointmentId = null;
                    
                    // Tìm thông tin dịch vụ từ appointment liên quan
                    // Có thể cần tìm appointment thông qua payment hoặc invoice
                    if (walletTransaction.getWallet() != null && walletTransaction.getWallet().getUser() != null) {
                        // Tìm appointment gần nhất của user này
                        List<Appointment> userAppointments = appointmentRepository.findByUsers_UserId(walletTransaction.getWallet().getUser().getUserId());
                        if (!userAppointments.isEmpty()) {
                            Appointment latestAppointment = userAppointments.get(0);
                            if (latestAppointment.getServices() != null) {
                                serviceName = latestAppointment.getServices().getServiceName();
                                serviceId = latestAppointment.getServices().getServiceId();
                            }
                            if (latestAppointment.getAppointmentDate() != null) {
                                appointmentDate = latestAppointment.getAppointmentDate().toString();
                            }
                            if (latestAppointment.getAppointmentType() != null) {
                                appointmentType = latestAppointment.getAppointmentType().toString();
                            }
                            appointmentId = latestAppointment.getAppointmentId();
                            appointmentInfo = "Lịch hẹn #" + latestAppointment.getAppointmentId() + 
                                            " - Ngày: " + appointmentDate + 
                                            " - Dịch vụ: " + serviceName;
                        }
                    }
                    
                    // Tính số dư sau giao dịch: số dư hiện tại - số tiền thanh toán
                    Long walletBalanceAfter = walletTransaction.getWallet().getBalance() - walletTransaction.getAmount();
                    
                    SystemTransactionHistoryResponse.TransactionRecord record = SystemTransactionHistoryResponse.TransactionRecord.builder()
                            .transactionId(walletTransaction.getWalletTransactionId())
                            .transactionType("INCOME")
                            .category("PAYMENT")
                            .amount(walletTransaction.getAmount())
                            .currency("VND")
                            .description("Thanh toán bằng ví - Dịch vụ: " + serviceName + " (" + appointmentType + ")")
                            .userName(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getFullName() : "Không xác định")
                            .userEmail(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getEmail() : "Không xác định")
                            .userPhone(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getPhone() : "Không có")
                            .timestamp(walletTransaction.getTimestamp())
                            .status(walletTransaction.getTransactionStatus().toString())
                            .paymentMethod("WALLET")
                            .appointmentInfo(appointmentInfo)
                            .serviceName(serviceName)
                            .serviceId(serviceId) // Lấy từ appointment nếu có
                            .appointmentId(appointmentId) // Lấy từ appointment nếu có
                            .appointmentDate(appointmentDate)
                            .appointmentType(appointmentType)
                            .createdBy(walletTransaction.getWallet().getUser() != null ? 
                                    walletTransaction.getWallet().getUser().getFullName() : "Không xác định")
                            .note("Thanh toán dịch vụ bằng ví")
                            .refTransactionId(null) // Không cần cho PAYMENT
                            .walletBalanceAfter(walletBalanceAfter) // Số dư ví sau giao dịch (đã trừ tiền thanh toán)
                            .build();
                    
                    transactions.add(record);
                    totalIncome += walletTransaction.getAmount(); // Tính vào doanh thu
                }
            }
        }

        // Sắp xếp theo thời gian mới nhất trước
        transactions.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

        return SystemTransactionHistoryResponse.builder()
                .transactions(transactions)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netAmount(totalIncome - totalExpense)
                .description("Tổng kết giao dịch hệ thống")
                .build();
    }
} 