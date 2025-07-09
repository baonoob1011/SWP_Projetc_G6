/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const SignUpByGoogle = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const decoded: any = jwtDecode(idToken);
      console.log('Thông tin Google:', decoded);

      // Gửi id_token lên backend
      const response = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }), // gửi với key là idToken
      });

      if (!response.ok) {
        throw new Error('Đăng nhập Google thất bại');
      }

      const result = await response.json();
      console.log('JWT từ backend:', result.token);

      // Lưu token hệ thống vào localStorage
      localStorage.setItem('token', result.token);

      // Chuyển hướng hoặc xử lý sau khi đăng nhập
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error.message);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.log('Đăng nhập Google thất bại');
        }}
      />
    </div>
  );
};

export default SignUpByGoogle;
