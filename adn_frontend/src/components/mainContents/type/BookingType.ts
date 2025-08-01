export type Patient = {
  patientId: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  relationship: string;
};
export type Kit = {
  kitId: string;
  kitCode: string;
  kitName: string;
  targetPersonCount: string;
  price: string;
  contents: string;
  quantity: string;
};
export type Appointment = {
  appointmentStatus: string;
};

export type Staff = {
  staffId: number;
  fullName: string;
  email: string;
  phone: string;
};

export type User = {
  userId: number;
  address: string | null;
  fullName: string;
  phone: string;
  email: string;
};

export type ShowResponse = {
  appointmentId: number;
  appointmentDate: string;
  appointmentStatus: string;
  note: string | null;
  appointmentType: string;
};

export type SlotResponse = {
  slotId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
};

export type ServiceResponse = {
  serviceId: number;
  serviceName: string;
  registerDate: string;
  description: string;
  serviceType: string;
};

export type LocationResponse = {
  locationId: number;
  addressLine: string;
  district: string;
  city: string;
};

export type RoomResponse = {
  roomName: string;
};

export type PaymentResponse = {
  paymentId: number;
  amount: number;
  paymentMethod: string;
  getPaymentStatus: string | null;
  transitionDate: string | null;
};

export type KitResponse = {
  kitCode: string;
  kitName: string;
  targetPersonCount: string;
  contents: string;
  kitStatus: string;
  deliveryDate: string;
  returnDate: string | null;
};

export type BookingHistoryItem = {
  show: ShowResponse;
  patients: Patient[];
  staff: Staff[];
  user: User | null;
  slot: SlotResponse[];
  services: ServiceResponse[];
  location: LocationResponse[];
  room: RoomResponse | null;
  payments: PaymentResponse[];
  kit?: KitResponse | null;
};
