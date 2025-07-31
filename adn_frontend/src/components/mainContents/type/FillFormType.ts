// types.ts

export type SlotInfo = {
  slotId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
  roomName: string;
};

export type Location = {
  locationId: string;
  addressLine: string;
  district: string;
  city: string;
};

export type Price = {
  priceId: string;
  price: string;
  time: string;
};

export type Patient = {
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

export const fieldLabels: {
  name: keyof Patient;
  label: string;
  type?: string;
}[] = [
  { name: 'fullName', label: 'Họ và tên' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Số điện thoại' },
  { name: 'address', label: 'Địa chỉ' },
  { name: 'dateOfBirth', label: 'Ngày sinh', type: 'date' },
  { name: 'identityNumber', label: 'CMND/CCCD' },
  { name: 'birthCertificate', label: 'Giấy khai sinh' },
];
