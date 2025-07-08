// Ví dụ: Trong trang Profile hoặc Booking
import React, { useState } from 'react';
import InvoicePopup from './PopupInvoice';

const GetInvoice = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [invoices, setInvoices] = useState([]);

  const handleOpenPopup = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/invoice/get-invoice-of-user',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!res.ok) throw new Error('Lỗi khi lấy hóa đơn');
      const data = await res.json();
      setInvoices(data);
      setShowPopup(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={handleOpenPopup}
      >
        Xem hóa đơn
      </button>

      <InvoicePopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        invoices={invoices}
      />
    </>
  );
};

export default GetInvoice;
