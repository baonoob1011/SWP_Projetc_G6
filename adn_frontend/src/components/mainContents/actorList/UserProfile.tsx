import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { NavLink } from 'react-router-dom';

type OldProfile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

const NewProfile = () => {
  const [profile, setProfile] = useState<OldProfile | null>(null);
  const [updateProfile, setUpdateProfile] = useState<OldProfile>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [editableField, setEditableField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: OldProfile = jwtDecode(token);
        setProfile(decoded);
        setUpdateProfile(decoded);
      } catch (error) {
        console.error('Lỗi giải mã token:', error);
        setError('Không thể đọc thông tin người dùng');
      }
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/user/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateProfile),
      });

      if (!res.ok) {
        setError('Cập nhật thất bại!');
        return;
      }

      const updated = await res.json();
      alert('Cập nhật thông tin thành công!');
      setProfile(updated);
      setUpdateProfile(updated);
    } catch (error) {
      console.error(error);
      setError('Lỗi kết nối với hệ thống');
    }
  };

  if (!profile)
    return <p className="text-center mt-5">Không có thông tin người dùng.</p>;

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Hồ sơ người dùng</h3>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        <table className="table table-bordered bg-white">
          <tbody>
            {[
              { field: 'fullName', label: 'Họ và tên' },
              { field: 'email', label: 'Email' },
              { field: 'phone', label: 'Số điện thoại' },
              { field: 'address', label: 'Địa chỉ' },
            ].map(({ field, label }) => (
              <tr key={field}>
                <th style={{ width: '30%' }}>{label}</th>
                <td>
                  <input
                    type="text"
                    name={field}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value={(updateProfile as any)[field]}
                    onChange={handleInput}
                    className="form-control"
                    readOnly={editableField !== field}
                    onClick={() => setEditableField(field)}
                    onBlur={() => setEditableField(null)}
                    placeholder={`Nhập ${label.toLowerCase()}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-primary w-50 me-2">
            Cập nhật
          </button>
          <NavLink to="/change-pass" className="btn btn-outline-secondary w-50">
            Đổi mật khẩu
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default NewProfile;
