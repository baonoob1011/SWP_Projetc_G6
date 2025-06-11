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
  { name: 'gender', label: 'Giới tính' },
  { name: 'relationship', label: 'Mối quan hệ' },
  { name: 'birthCertificate', label: 'Giấy khai sinh (nếu có)' },
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
    <div className="container mt-130">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <h4>🧍 Thông tin người thứ nhất</h4>
            {fieldLabels.map(({ name, label, type }) => (
              <div className="mb-3" key={`one-${name}`}>
                <label className="form-label">{label}</label>
                <input
                  type={type || 'text'}
                  name={name}
                  className="form-control"
                  value={patientOne[name]}
                  onChange={handleInputPatientOne}
                />
              </div>
            ))}
          </div>

          <div className="col-md-6">
            <h4>🧍‍♂️ Thông tin người thứ hai</h4>
            {fieldLabels.map(({ name, label, type }) => (
              <div className="mb-3" key={`two-${name}`}>
                <label className="form-label">{label}</label>
                <input
                  type={type || 'text'}
                  name={name}
                  className="form-control"
                  value={patientTwo[name]}
                  onChange={handleInputPatientTwo}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary px-4">
            Gửi đăng ký
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRequest;
