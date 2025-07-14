package swp.project.adn_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import swp.project.adn_backend.entity.AdministrativeService;
import swp.project.adn_backend.entity.Appointment;
import swp.project.adn_backend.enums.AppointmentStatus;

import java.util.List;

@RepositoryRestResource(path = "appointment")
public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    List<Appointment> findByUsers_UserId(Long userId); // nếu user là object
    List<Appointment> findByStaff_StaffId(Long staffId); // nếu user là object
    // Đếm số lượng user duy nhất đã từng có appointment (đăng ký dịch vụ)
    @Query("SELECT COUNT(DISTINCT a.users.userId) FROM Appointment a WHERE a.users IS NOT NULL")
    long countDistinctUsersRegisteredService();
    
    // Đếm số lượng user duy nhất đã hoàn thành appointment
    @Query("SELECT COUNT(DISTINCT a.users.userId) FROM Appointment a WHERE a.users IS NOT NULL AND a.appointmentStatus = 'COMPLETED'")
    long countDistinctUsersWithCompletedAppointments();
    
    // Đếm tổng số appointment đã hoàn thành
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentStatus = 'COMPLETED'")
    long countCompletedAppointments();
    
    // Đếm tổng số appointment đã hủy
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentStatus = 'CANCELLED'")
    long countCancelledAppointments();
    
    // Đếm tổng số appointment đang chờ
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentStatus = 'PENDING'")
    long countPendingAppointments();
    
    // Đếm tổng số appointment đã xác nhận
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentStatus = 'CONFIRMED'")
    long countConfirmedAppointments();
    
    // Đếm tổng số appointment đã đánh giá
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentStatus = 'RATED'")
    long countRatedAppointments();
}
