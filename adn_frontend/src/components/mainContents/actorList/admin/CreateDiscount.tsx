import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Percent, Plus, Tag } from 'lucide-react';

const CreateDiscount = () => {
  const [discount, setDiscount] = useState({
    discountName: '',
    discountValue: '',
    startDate: '',
    endDate: '',
  });
  const { serviceId } = useParams<string>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiscount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/discount/create-discount-service?serviceId=${serviceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // nếu có auth
          },
          body: JSON.stringify({
            ...discount,
            discountValue: parseFloat(discount.discountValue), // đảm bảo là kiểu double
          }),
        }
      );

      if (!response.ok) throw new Error('Tạo giảm giá thất bại');

      toast.success('Tạo giảm giá thành công!');
      setDiscount({
        discountName: '',
        discountValue: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.log(error);
      toast.error('Đã xảy ra lỗi khi tạo giảm giá');
    }
  };

 return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 rounded-3xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-700/20 backdrop-blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Percent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Tạo chương trình giảm giá</h1>
                <p className="text-blue-100">Thiết lập chương trình khuyến mãi mới cho dịch vụ của bạn</p>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 right-12 w-20 h-20 bg-purple-300/20 rounded-full blur-xl"></div>
        </div>

        {/* Form Section - Keeping your original Box structure */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex flex-col gap-6">
            {/* Program Name */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Tên chương trình</label>
              </div>
              <input
                type="text"
                name="discountName"
                value={discount.discountName}
                onChange={handleChange}
                placeholder="Nhập tên chương trình..."
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-white/50"
                required
              />
            </div>

            {/* Discount Value */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Percent className="w-5 h-5 text-emerald-600" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Giá trị giảm (%)</label>
              </div>
              <input
                type="number"
                name="discountValue"
                min="0"
                max="100"
                step="0.1"
                value={discount.discountValue}
                onChange={handleChange}
                placeholder="0 - 100"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-white/50"
                required
              />
            </div>

            {/* Start Date */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Ngày bắt đầu</label>
              </div>
              <input
                type="date"
                name="startDate"
                value={discount.startDate}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 text-gray-700 bg-white/50"
                required
              />
            </div>

            {/* End Date */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl">
                  <Clock className="w-5 h-5 text-rose-600" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Ngày kết thúc</label>
              </div>
              <input
                type="date"
                name="endDate"
                value={discount.endDate}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all duration-300 text-gray-700 bg-white/50"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={handleSubmit}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  <span>Tạo giảm giá</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateDiscount;
