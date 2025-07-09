import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const CreateDiscount = () => {
  const [discount, setDiscount] = useState({
    discountName: '',
    discountValue: '',
    startDate: '',
    endDate: '',
  });
  const { serviceId } = useParams<string>();
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      setShowCreateForm(false);
    } catch (error) {
      console.log(error);
      toast.error('Đã xảy ra lỗi khi tạo giảm giá');
    }
  };

  return (
    <div className="min-h-screen bg-white ml-10">
      <div className="max-w-full">
        {/* Statistics Header */}
        <div className="bg-[#4162EB] rounded-lg p-6 mb-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white text-lg font-semibold">Quản lý chương trình giảm giá</h2>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-blue-100">
            <span className="text-white font-medium">Admin</span>
            <span className="mx-2">›</span>
            <span>Discount</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Thêm Giảm Giá
          </button>
        </div>

        {/* Create Form - Collapsible */}
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Thêm chương trình giảm giá mới</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên chương trình
                    </label>
                    <input
                      type="text"
                      name="discountName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={discount.discountName}
                      onChange={handleChange}
                      placeholder="Nhập tên chương trình giảm giá"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị giảm (%)
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={discount.discountValue}
                      onChange={handleChange}
                      placeholder="Nhập giá trị giảm (0-100%)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={discount.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={discount.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Tạo Giảm Giá
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin chương trình giảm giá</h3>
          <div className="text-gray-600">
            <p className="mb-2">• Chương trình giảm giá sẽ được áp dụng cho dịch vụ được chọn</p>
            <p className="mb-2">• Giá trị giảm tính theo phần trăm từ 0% đến 100%</p>
            <p className="mb-2">• Ngày bắt đầu phải trước ngày kết thúc</p>
            <p>• Chương trình sẽ tự động kích hoạt trong khoảng thời gian đã chọn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDiscount;