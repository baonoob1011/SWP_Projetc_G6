import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import OldPassWord from '../feature/OldPassword';
import BookingHistory from '../feature/BookingHistory';

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
  const [activeTab, setActiveTab] = useState<
    'profile' | 'changePassword' | 'history'
  >('profile');

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
        const errorText = await res.text();
        toast.error('❌ Cập nhật thất bại: ' + errorText);
        return;
      }

      const updated = await res.json();
      toast.success('✅ Cập nhật thông tin thành công!');
      setProfile(updated);
      setUpdateProfile(updated);
    } catch (error) {
      console.error(error);
      toast.error('❌ Lỗi kết nối với hệ thống');
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row" style={{ marginTop: 120 }}>
        {/* Sidebar */}
        <div className="col-md-3" style={{ marginTop: 57 }}>
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${
                activeTab === 'profile' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Hồ sơ cá nhân
            </button>

            <button
              className={`list-group-item list-group-item-action ${
                activeTab === 'changePassword' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('changePassword')}
            >
              Đổi mật khẩu
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                activeTab === 'history' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('history')}
            >
              Lịch sử
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9">
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {activeTab === 'profile' && profile && (
            <>
              <h3 className="mb-4">Hồ sơ người dùng</h3>
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

                <button type="submit" className="btn btn-primary mt-3">
                  Cập nhật
                </button>
              </form>
            </>
          )}

          {activeTab === 'changePassword' && (
            <>
              <h3 className="mb-4">Đổi mật khẩu</h3>
              <OldPassWord
                role={
                  (localStorage.getItem('role') as
                    | 'USER'
                    | 'STAFF'
                    | 'MANAGER') || 'USER'
                }
              />
            </>
          )}

          {activeTab === 'history' && (
            <>
              <h3 className="mb-4">Lịch sử đặt lịch</h3>
              <BookingHistory />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProfile;
