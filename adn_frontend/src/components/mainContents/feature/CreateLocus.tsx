import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './CreateLocus.module.css';

type Locus = {
  locusName: string;
  description: string;
};

type FormErrors = {
  locusName: string;
  description: string;
};

const CreateLocus = () => {
  const [locus, setLocus] = useState<Locus>({
    locusName: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    locusName: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocus((locus) => ({
      ...locus,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocus((locus) => ({
      ...locus,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      locusName: '',
      description: '',
    };

    if (!locus.locusName.trim()) {
      newErrors.locusName = 'Tên locus không được để trống';
    } else if (locus.locusName.trim().length < 2) {
      newErrors.locusName = 'Tên locus phải có ít nhất 2 ký tự';
    }

    if (!locus.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }

    setErrors(newErrors);
    return !newErrors.locusName && !newErrors.description;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin hợp lệ');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Current token:', token ? 'Token exists' : 'No token found');
      
      // Parse token to get user info for debugging
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          console.log('User role:', tokenPayload.role || 'Role not found');
          console.log('User info:', tokenPayload);
        } catch {
          console.log('Cannot parse token');
        }
      }

      const res = await fetch('http://localhost:8080/api/locus/create-locus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(locus),
      });
      
      console.log('Response status:', res.status);
      console.log('Response statusText:', res.statusText);
      
      if (!res.ok) {
        let errorMessage = `Lỗi ${res.status}: `; // mặc định với status code

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          console.log('Error response:', errorData);
          
          // Xử lý các lỗi phổ biến
          if (res.status === 403) {
            errorMessage += 'Bạn không có quyền tạo locus. Vui lòng liên hệ quản trị viên.';
          } else if (res.status === 401) {
            errorMessage += 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          } else if (res.status === 400) {
            errorMessage += errorData.message || 'Dữ liệu không hợp lệ';
          } else {
            errorMessage += errorData.message || 'Không thể tạo locus';
          }
        } else {
          const textError = await res.text();
          console.log('Text error response:', textError);
          
          if (res.status === 403) {
            errorMessage += 'Bạn không có quyền tạo locus (Manager role có thể không được phép)';
          } else if (res.status === 401) {
            errorMessage += 'Không có quyền truy cập. Vui lòng đăng nhập lại.';
          } else {
            errorMessage += textError || 'Lỗi không xác định';
          }
        }

        toast.error(errorMessage);
      } else {
        toast.success('Tạo locus thành công');
        // Reset form after successful submission
        setLocus({
          locusName: '',
          description: '',
        });
        setErrors({
          locusName: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormControlClass = (fieldName: keyof Locus) => {
    let className = styles.formControl;
    if (errors[fieldName]) {
      className += ` ${styles.isInvalid}`;
    } else if (locus[fieldName]) {
      className += ` ${styles.isValid}`;
    }
    return className;
  };

  return (
    <div className={styles.createLocusContainer}>
      <div className={styles.createLocusCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
          Tạo Locus Mới
          </h2>
          <p className={styles.cardSubtitle}>Vui lòng điền đầy đủ thông tin để tạo locus</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.locusForm}>
          <div className={styles.formGroup}>
            <label htmlFor="locusName" className={styles.formLabel}>
              Tên Locus <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={getFormControlClass('locusName')}
              id="locusName"
              name="locusName"
              onChange={handleInput}
              value={locus.locusName}
              placeholder="Nhập tên locus (ví dụ: D3S1358)"
              disabled={isSubmitting}
            />
            {errors.locusName && (
              <div className={styles.invalidFeedback}>
                ⚠️ {errors.locusName}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>
              Mô tả <span className={styles.required}>*</span>
            </label>
            <textarea
              className={getFormControlClass('description')}
              id="description"
              name="description"
              onChange={handleTextareaInput}
              value={locus.description}
              placeholder="Nhập mô tả chi tiết về locus này..."
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <div className={styles.invalidFeedback}>
                ⚠️ {errors.description}
              </div>
            )}
            <div className={styles.formText}>
              Nhập mô tả về locus này
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.btnSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinnerBorderSm} role="status"></span>
                  &nbsp; Đang tạo...
                </>
              ) : (
                <>
                  Tạo Locus
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLocus;
