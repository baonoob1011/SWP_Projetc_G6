/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../../../image/Logo.png';
import Sign from '../../../image/Sign.png';
import ExportResultPDF from './PrintPDF';

const GetAllResult = () => {
  const { appointmentId } = useParams();
  const [isResult, setIsResult] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/appointment/get-all-result?appointmentId=${appointmentId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) {
        toast.error('Không thể lấy dữ liệu');
        return;
      }

      const data = await res.json();
      setIsResult(data);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi hệ thống khi lấy dữ liệu');
    }
  };

  useEffect(() => {
    if (appointmentId) fetchData();
  }, [appointmentId]);

  const today = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {isResult
          .filter(
            (item) =>
              item.resultAppointmentResponse?.[0]?.resultStatus === 'COMPLETED'
          )
          .map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden"
            >
              {/* Back Button */}
              <div className="p-6 bg-gray-50 border-b mt-20">
                <Button
                  component={NavLink}
                  to="/u-profile"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowBack />
                  Quay lại
                </Button>
              </div>

              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-6">
                    {/* Logo và thông tin công ty */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={Logo}
                          alt="GENELINK Logo"
                          className="w-32 h-24 object-contain"
                        />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-blue-600 mb-1">
                          CÔNG TY TNHH GENELINK
                        </h1>
                        <h2 className="text-base font-semibold text-gray-700 mb-2">
                          TRUNG TÂM PHÂN TÍCH ADN
                        </h2>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                          <p>Hotline: 1900-xxxx | Email: info@genelink.vn</p>
                          <p>Website: www.genelink.vn</p>
                        </div>
                      </div>
                    </div>

                    {/* Số báo cáo */}
                    <div className="border-2 border-blue-600 rounded-lg p-4 text-center min-w-[140px]">
                      <p className="text-sm font-semibold text-blue-600">Số:</p>
                      <p className="text-lg font-bold text-blue-600">
                        KQ {item.showAppointmentResponse?.appointmentId}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Ngày: {today}
                      </p>
                    </div>
                  </div>

                  {/* Đường kẻ ngang */}
                  <div className="h-0.5 bg-blue-600 mb-6"></div>

                  {/* Tiêu đề chính */}
                  <div className="text-center bg-gray-50 py-6 rounded-lg mb-8">
                    <h2 className="text-2xl font-bold text-blue-600 mb-2">
                      PHIẾU KẾT QUẢ PHÂN TÍCH ADN
                    </h2>
                    <p className="text-base text-gray-600">
                      (Xét nghiệm quan hệ huyết thống)
                    </p>
                  </div>
                </div>

                {/* Phần I: Thông tin khách hàng */}
                <div className="mb-8">
                  <div className="bg-blue-50 p-4 rounded-t-lg">
                    <h3 className="text-base font-bold text-blue-600">
                      I. THÔNG TIN KHÁCH HÀNG
                    </h3>
                  </div>
                  <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      <div className="grid grid-cols-12 p-4 hover:bg-gray-50">
                        <div className="col-span-4 text-sm font-semibold text-gray-700">
                          Họ và tên người yêu cầu:
                        </div>
                        <div className="col-span-8 text-sm text-gray-800">
                          {item.userAppointmentResponse.fullName}
                        </div>
                      </div>
                      <div className="grid grid-cols-12 p-4 hover:bg-gray-50">
                        <div className="col-span-4 text-sm font-semibold text-gray-700">
                          Số điện thoại:
                        </div>
                        <div className="col-span-8 text-sm text-gray-800">
                          {item.userAppointmentResponse.phone}
                        </div>
                      </div>
                      <div className="grid grid-cols-12 p-4 hover:bg-gray-50">
                        <div className="col-span-4 text-sm font-semibold text-gray-700">
                          Địa chỉ:
                        </div>
                        <div className="col-span-8 text-sm text-gray-800">
                          {item.userAppointmentResponse.address}
                        </div>
                      </div>
                      <div className="grid grid-cols-12 p-4 hover:bg-gray-50">
                        <div className="col-span-4 text-sm font-semibold text-gray-700">
                          Ngày tiếp nhận mẫu:
                        </div>
                        <div className="col-span-8 text-sm text-gray-800">
                          {item.showAppointmentResponse?.appointmentDate}
                        </div>
                      </div>
                      <div className="grid grid-cols-12 p-4 hover:bg-gray-50"></div>
                    </div>
                  </div>
                </div>

                {/* Phần II: Thông tin mẫu phân tích */}
                <div className="mb-8">
                  <div className="bg-blue-50 p-4 rounded-t-lg">
                    <h3 className="text-base font-bold text-blue-600">
                      II. THÔNG TIN MẪU PHÂN TÍCH
                    </h3>
                  </div>
                  <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          <th className="p-3 text-sm font-semibold text-center">
                            STT
                          </th>
                          <th className="p-3 text-sm font-semibold text-center">
                            Họ và tên
                          </th>
                          <th className="p-3 text-sm font-semibold text-center">
                            Quan hệ
                          </th>
                          <th className="p-3 text-sm font-semibold text-center">
                            Loại mẫu
                          </th>
                          <th className="p-3 text-sm font-semibold text-center">
                            Ngày thu mẫu
                          </th>
                          <th className="p-3 text-sm font-semibold text-center">
                            Ký hiệu mẫu
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {item.patientAppointmentResponse
                          ?.slice(0, 2)
                          .map((patient: any, i: number) => (
                            <tr
                              key={i}
                              className={
                                i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                              }
                            >
                              <td className="p-3 text-sm text-center text-gray-800">
                                {i + 1}
                              </td>
                              <td className="p-3 text-sm text-center text-gray-800 font-medium">
                                {patient.fullName}
                              </td>
                              <td className="p-3 text-sm text-center text-gray-800">
                                {patient.relationship}
                              </td>
                              <td className="p-3 text-sm text-center text-gray-800">
                                {item.sampleAppointmentResponse?.[0].sampleType}
                              </td>
                              <td className="p-3 text-sm text-center text-gray-800">
                                {item.showAppointmentResponse?.appointmentDate}
                              </td>
                              <td className="p-3 text-sm text-center text-gray-800">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                  {item.sampleAppointmentResponse?.[i]
                                    ?.sampleCode || '---'}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Phần III: Kết quả phân tích */}
                <div className="mb-8">
                  <div className="bg-blue-50 p-4 rounded-t-lg">
                    <h3 className="text-base font-bold text-blue-600">
                      III. KẾT QUẢ PHÂN TÍCH
                    </h3>
                  </div>
                  <div className="border border-gray-200 rounded-b-lg p-4">
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      Sau khi phân tích các mẫu ADN có ký hiệu trên bằng bộ kit
                      Identifiler Plus của hãng Applied Biosystems - Mỹ, chúng
                      tôi có kết quả như sau:
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                          <tr>
                            <th className="p-3 text-sm font-semibold text-center">
                              Locus
                            </th>
                            <th className="p-3 text-sm font-semibold text-center">
                              {item.resultLocusAppointmentResponse?.[0]
                                ?.sampleCode1 || 'Mã mẫu 1'}
                            </th>
                            <th className="p-3 text-sm font-semibold text-center">
                              {item.resultLocusAppointmentResponse?.[0]
                                ?.sampleCode2 || 'Mã mẫu 2'}
                            </th>
                            <th className="p-3 text-sm font-semibold text-center">
                              Chỉ số PI
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {item.resultLocusAppointmentResponse?.map(
                            (locus: any, i: number) => (
                              <tr
                                key={i}
                                className={
                                  i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                }
                              >
                                <td className="p-3 text-sm text-center text-gray-800 font-medium">
                                  {locus.locusName}
                                </td>
                                <td className="p-3 text-sm text-center text-gray-800">
                                  {locus.allele1} - {locus.allele2}
                                </td>
                                <td className="p-3 text-sm text-center text-gray-800">
                                  {locus.fatherAllele1 ?? 'N/A'} -{' '}
                                  {locus.fatherAllele2 ?? 'N/A'}
                                </td>
                                <td className="p-3 text-sm text-center text-gray-800 font-mono">
                                  {locus.pi?.toFixed(6)}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="bg-orange-50">
                            <td
                              colSpan={3}
                              className="p-3 text-sm font-bold text-left text-orange-800"
                            >
                              Tổng CPI:
                            </td>
                            <td className="p-3 text-sm font-bold text-center text-orange-800 font-mono">
                              {(
                                item.resultDetailAppointmentResponse?.[0]
                                  ?.paternityProbability /
                                (100 -
                                  item.resultDetailAppointmentResponse?.[0]
                                    ?.paternityProbability)
                              )?.toFixed(6)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Xác suất huyết thống */}
                <div className="mb-8">
                  <div className="border-2 border-orange-400 rounded-lg p-6 bg-orange-50">
                    <div className="text-center">
                      <h3 className="text-base font-bold text-orange-700 mb-2">
                        XÁC SUẤT HUYẾT THỐNG
                      </h3>
                      <p className="text-3xl font-bold text-orange-600">
                        {item.resultDetailAppointmentResponse?.[0]?.paternityProbability?.toFixed(
                          4
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phần IV: Kết luận */}
                <div className="mb-8">
                  <div className="bg-blue-50 p-4 rounded-t-lg">
                    <h3 className="text-base font-bold text-blue-600">
                      IV. KẾT LUẬN
                    </h3>
                  </div>
                  <div className="border border-gray-200 rounded-b-lg p-4">
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      Dựa trên kết quả phân tích ADN, người có mẫu ký hiệu{' '}
                      <span className="font-semibold text-blue-600">
                        {item.resultLocusAppointmentResponse?.[0]?.sampleCode1}
                      </span>{' '}
                      và người có mẫu ký hiệu{' '}
                      <span className="font-semibold text-blue-600">
                        {item.resultLocusAppointmentResponse?.[0]?.sampleCode2}
                      </span>{' '}
                      có kết luận:
                    </p>

                    <div
                      className={`border-2 rounded-lg p-6 text-center ${
                        item.resultDetailAppointmentResponse?.[0]
                          ?.paternityProbability >= 99
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <p
                        className={`text-xl font-bold ${
                          item.resultDetailAppointmentResponse?.[0]
                            ?.paternityProbability >= 99
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {item.resultDetailAppointmentResponse?.[0]
                          ?.paternityProbability >= 99
                          ? 'CÓ QUAN HỆ HUYẾT THỐNG'
                          : 'KHÔNG CÓ QUAN HỆ HUYẾT THỐNG'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phần V: Ghi chú */}
                <div className="mb-8">
                  <div className="bg-blue-50 p-4 rounded-t-lg">
                    <h3 className="text-base font-bold text-blue-600">
                      V. GHI CHÚ
                    </h3>
                  </div>
                  <div className="border border-gray-200 rounded-b-lg p-4 bg-gray-50">
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>
                          {item.serviceAppointmentResponses?.serviceType ===
                          'ADMINISTRATIVE'
                            ? 'Kết quả xét nghiệm này được sử dụng cho mục đích hành chính, có thể làm căn cứ pháp lý trong các thủ tục như xác nhận cha con, khai sinh, hoặc các vấn đề pháp lý liên quan.'
                            : 'Kết quả xét nghiệm này được sử dụng cho mục đích dân sự, chỉ mang tính tham khảo cá nhân và không có giá trị pháp lý.'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Chữ ký */}
                <div className="grid grid-cols-2 gap-8 border border-gray-200 rounded-lg p-6">
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-blue-600 mb-2">
                      NGƯỜI THỰC HIỆN
                    </h4>
                    <p className="text-xs text-gray-600 mb-4 italic">
                      (Ký tên và đóng dấu)
                    </p>
                    <div className="h-16 mb-2"></div>
                    <p className="text-sm font-semibold text-gray-700">
                      Kỹ thuật viên
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-blue-600 mb-2">
                      GIÁM ĐỐC TRUNG TÂM
                    </h4>
                    <p className="text-xs text-gray-600 mb-4 italic">
                      (Ký tên và đóng dấu)
                    </p>
                    <div className="flex justify-center mb-2">
                      <img
                        src={Sign}
                        alt="Chữ ký"
                        className="w-48 h-32 object-contain"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      Trần Đình Bảo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* Export PDF Components */}
        {isResult
          .filter(
            (item) =>
              item.resultAppointmentResponse?.[0]?.resultStatus === 'COMPLETED'
          )
          .map((item, index) => (
            <ExportResultPDF key={index} item={item} />
          ))}
      </div>
    </div>
  );
};

export default GetAllResult;
