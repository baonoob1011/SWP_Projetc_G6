import { useState } from 'react';

type Patient = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  identityNumber: string;
  gender: string;
  relationship: string;
  birthCertificate: string;
};

const fieldLabels: { name: keyof Patient; label: string; type?: string }[] = [
  { name: 'fullName', label: 'Họ và tên' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Số điện thoại' },
  { name: 'address', label: 'Địa chỉ' },
  { name: 'dateOfBirth', label: 'Ngày sinh', type: 'date' },
  { name: 'identityNumber', label: 'CMND/CCCD' },
  { name: 'relationship', label: 'Mối quan hệ' },
  { name: 'birthCertificate', label: 'Giấy khai sinh (nếu có)' },
  // ❌ Đã bỏ gender khỏi đây để xử lý riêng bằng radio
];

const PatientRequest = () => {
  const [patientOne, setPatientOne] = useState<Patient>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    identityNumber: '',
    gender: '',
    relationship: '',
    birthCertificate: '',
  });

  const [patientTwo, setPatientTwo] = useState<Patient>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    identityNumber: '',
    gender: '',
    relationship: '',
    birthCertificate: '',
  });

  const handleInputPatientOne = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientOne((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputPatientTwo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientTwo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(
        'http://localhost:8080/api/patient/register-info',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify([patientOne, patientTwo]),
        }
      );
      if (!res.ok) {
        alert('Không thể đăng ký');
      } else {
        alert('Đăng ký thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-30">
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Người thứ nhất */}
          <div
            className="col-md-6"
            style={{
              backgroundColor: '#f0f8ff',
              border: '2px solid #0d6efd',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{
                color: '#0d6efd',
                fontWeight: 'bold',
                marginBottom: '24px',
              }}
            >
              🧍 Thông tin người thứ nhất
            </h4>
            {fieldLabels.map(({ name, label, type }) => (
              <div className="mb-3" key={`one-${name}`}>
                <label
                  className="form-label"
                  style={{ color: '#495057', fontWeight: 600 }}
                >
                  {label}
                </label>
                <input
                  type={type || 'text'}
                  name={name}
                  className="form-control"
                  style={{
                    border: '2px solid #0d6efd',
                    borderRadius: '8px',
                  }}
                  value={patientOne[name]}
                  onChange={handleInputPatientOne}
                />
              </div>
            ))}

            {/* Gender radio */}
            <div className="mb-3">
              <label
                className="form-label d-block"
                style={{ fontWeight: 600, color: '#495057' }}
              >
                Giới tính
              </label>
              {['Nam', 'Nữ'].map((gender) => (
                <div
                  className="form-check form-check-inline"
                  key={`one-gender-${gender}`}
                  style={{ marginRight: '15px' }}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id={`one-gender-${gender}`}
                    value={gender}
                    checked={patientOne.gender === gender}
                    onChange={handleInputPatientOne}
                    style={{ accentColor: '#0d6efd' }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`one-gender-${gender}`}
                    style={{ fontWeight: 500 }}
                  >
                    {gender}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Người thứ hai */}
          <div
            className="col-md-6"
            style={{
              backgroundColor: '#e8fff3',
              border: '2px solid #198754',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{
                color: '#198754',
                fontWeight: 'bold',
                marginBottom: '24px',
              }}
            >
              🧍‍♂️ Thông tin người thứ hai
            </h4>
            {fieldLabels.map(({ name, label, type }) => (
              <div className="mb-3" key={`two-${name}`}>
                <label
                  className="form-label"
                  style={{ color: '#495057', fontWeight: 600 }}
                >
                  {label}
                </label>
                <input
                  type={type || 'text'}
                  name={name}
                  className="form-control"
                  style={{
                    border: '2px solid #198754',
                    borderRadius: '8px',
                  }}
                  value={patientTwo[name]}
                  onChange={handleInputPatientTwo}
                />
              </div>
            ))}

            {/* Gender radio */}
            <div className="mb-3">
              <label
                className="form-label d-block"
                style={{ fontWeight: 600, color: '#495057' }}
              >
                Giới tính
              </label>
              {['Nam', 'Nữ'].map((gender) => (
                <div
                  className="form-check form-check-inline"
                  key={`two-gender-${gender}`}
                  style={{ marginRight: '15px' }}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender2"
                    id={`two-gender-${gender}`}
                    value={gender}
                    checked={patientTwo.gender === gender}
                    onChange={(e) =>
                      setPatientTwo((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    style={{ accentColor: '#198754' }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`two-gender-${gender}`}
                    style={{ fontWeight: 500 }}
                  >
                    {gender}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-primary px-4"
            style={{
              backgroundColor: '#0d6efd',
              borderColor: '#0d6efd',
              borderRadius: '10px',
              padding: '10px 30px',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            Gửi đăng ký
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRequest;
