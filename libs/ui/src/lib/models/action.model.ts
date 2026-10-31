export enum AppointmentType {
  Physical = 'Physical',
  Virtual = 'Virtual',
}

export enum PaymentMethod {
  Paystack = 'Paystack',
}

export enum PaymentTypes {
  Inflow = 'Inflow',
  Outflow = 'Outflow',
}

export enum RegisteredBankStatus {
  Enabled = 'enable',
  Disabled = 'disable',
}

export enum Currency {
  NGN = 'NGN'
}

export enum FacilityType {
  Pharmacy = 'Pharmacy',
  Hospital = 'Hospital',
  Laboratory = 'Laboratory',
  Radiology = 'Radiology',
  BloodBank = 'Blood Bank',
}

export enum OrderType {
  ServiceRequestOrder = 'Service Request Order',
  AppointmentOrder = 'Appointment Order',
  HmoProductOrder = 'HMO Product Order',
}

export enum LimitSize {
  DropDown = 1000000,
}

export enum CardIdentityType {
  Member = 'Member',
  Doctor = 'Doctor',
  Nurse = 'Nurse',
  Patient = 'Patient',
  Pharmacist = 'Pharmacist',
  Radiologist = 'Radiologist',
  Hospital = 'Hospital',
  LaboratoryStaff = 'LaboratoryStaff',
  LabTechnician = 'Blood Bank',
}
