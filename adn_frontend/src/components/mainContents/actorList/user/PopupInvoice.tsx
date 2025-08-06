import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

type Invoice = {
  id: number;
  amount: number;
  createdDate: string;
  payDate: string;
  bankCode: string;
  transactionStatus: string;
  orderInfo: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  invoices: Invoice[];
};

const InvoicePopup: React.FC<Props> = ({ visible, onClose, invoices }) => {
  useEffect(() => {
    if (visible) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [visible]);

  if (!visible) return null;

  const popupContent = (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center backdrop-blur-sm bg-white/10">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button
            className="text-gray-600 hover:text-red-500 text-lg font-bold"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {invoices.length === 0 ? (
          <p className="text-gray-500">Không có hóa đơn nào.</p>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="border border-gray-200 rounded-lg p-4 space-y-2 mb-4"
            >
              <p>
                <span className="font-medium text-gray-700">Số tiền:</span>{' '}
                {invoice.amount.toLocaleString('vi-VN')} VNĐ
              </p>
              <p>
                <span className="font-medium text-gray-700">Ngày tạo:</span>{' '}
                {new Date(invoice.createdDate).toLocaleString('vi-VN')}
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Ngày thanh toán:
                </span>{' '}
                {new Date(invoice.payDate).toLocaleString('vi-VN')}
              </p>
              <p>
                <span className="font-medium text-gray-700">Mã hóa đơn:</span>{' '}
                {invoice.bankCode}
              </p>
              <p>
                <span className="font-medium text-gray-700">Loại dịch vụ:</span>{' '}
                {invoice.orderInfo}
              </p>
              <p>
                <span className="font-medium text-gray-700">Trạng thái:</span>{' '}
                <span
                  className={`font-semibold ${
                    invoice.transactionStatus === 'SUCCESS'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {invoice.transactionStatus === 'SUCCESS'
                    ? 'Đã thanh toán'
                    : 'Chưa thanh toán'}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(popupContent, document.body);
};

export default InvoicePopup;
