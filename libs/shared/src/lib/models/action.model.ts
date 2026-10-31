export enum Relationship {
  Mother = 'Mother',
  Father = 'Father',
  Son = 'Son',
  Daughter = 'Daughter',
  'In Law' = 'In Law',
  Wife = 'Wife',
  Husband = 'Husband',
  Cousin = 'Cousin',
  Relative = 'Relative',
  Others = 'Others',
}
export enum ImagingProcedure {
  ComputedTomography = 'Computed Tomography',
  Fluoroscopy = 'Fluoroscopy',
  MagneticResonanceImaging = 'Magnetic Resonance Imaging',
  Mammography = 'Mammography',
  NuclearMedicine = 'Nuclear Medicine',
  Ultrasound = 'Ultrasound',
  XRay = 'X-ray',
  BoneScan = 'Bone Scan',
  ThyroidScan = 'Thyroid Scan',
  MRI = 'MRI',
  PETScan = 'PET Scan',
  ThalliumCardiac = 'Thallium Cardiac',
  TumorAblation = 'Tumor Ablation',
  Embolization = 'Embolization',
  Angiography = 'Angiography',
  Biopsy = 'Biopsy',
  Chemoembolization = 'Chemoembolization',
  Vertebroplasty = 'Vertebroplasty',
  FeedingTubePlacement = 'Feeding tube placement',
  VenousAccessCatheterization = 'Venous access catheterization',
}

export enum UOM {
  Pieces = 'Pieces',
  Packets = 'Packets',
}

export enum TestingType {
  PostPrandial = 'Postprandial',
  Fasting = 'Fasting',
  Random = 'Random',
  OGTT = 'OGTT',
}

export enum DocumentStatus {
  Draft = 'Draft',
  All = 'All',
  Pending = 'Pending',
  Processed = 'Processed',
  Declined = 'Declined',
  Cancelled = 'Cancelled',
  Ordered = 'Ordered',
  Delivered = 'Delivered',
  Accepted = 'Accepted',
  Dispatched = 'Dispatched',
  Fulfilment_Created = 'Fulfilment Created',
  Shipped = 'Shipped',
}

export enum GreenBookItemStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}
export enum PinType {
  Delivery = 'Delivery',
  Fulfilment = 'Fulfilment',
}

export enum Status {
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum Form {
  Capsule = 'Capsule',
  Cream = 'Cream',
  Injection = 'Injection',
  Liquid = 'Liquid',
  'Solution for Injection' = 'Solution for Injection',
  Syrup = 'Syrup',
  Tablet = 'Tablet',
}

export enum Module {
  CUSTOMER = 'Customer',
  MEDICAL_FACILITY = 'Medical-facility',
  BACK_OFFICE = 'Back-office',
  RIDER = 'Rider',
}

export enum ActiveIngredient {
  Tocilizumab = 'Tocilizumab',
  'Tincture of Matricaria' = 'Tincture of Matricaria',
}

export enum DrugsForms {
  CAPSULE = 'Capsule',
  TABLET = 'Tablet',
  CREAM = 'Cream',
  INJECTION = 'Injection',
  SOLUTION_FOR_INJECTON = 'Solution for Injection',
  SYRUP = 'Syrup',
}

export enum CostFlow {
  PHARMACY = 'pharmacy',
  LABTEST = 'labtest',
  RADIOLOGY = 'radiology',
  BLOODBANK = 'bloodbank',
}

export enum ProductName {
  'Actemra 162 mg' = 'Actemra 162 mg',
  'Actemra 200 mg' = 'Actemra 200 mg',
  'Actemra 400 mg' = 'Actemra 400 mg',
  'Actemra 80 mg' = 'Actemra 80 mg',
}

export enum Strength {
  '162 mg/0.9 mL' = '162 mg/0.9 mL',
}

export enum Frequency {
  'Daily' = 'Daily',
  'Twice daily' = 'Twice daily',
  'Three times daily' = 'Three times daily',
  'Four times daily' = 'Four times daily',
  'Every morning (before noon)' = 'Every morning (before noon)',
  'Every evening or night (after noon)' = 'Every evening or night (after noon)',
  'Every Week' = 'Every Week',
  'Twice a week' = 'Twice a week',
  'Three times a week' = 'Three times a week',
  'As needed or as necessary' = 'As needed or as necessary',
  'immediately or at once' = 'immediately or at once',
  'Before meals' = 'Before meals',
  'After meals' = 'After meals',
  'At bedtime or hour of sleep' = 'At bedtime or hour of sleep',
  'As directed' = 'As directed',
}

export enum Category {
  'Jodascan Injection 300mg' = 'Jodascan Injection 300mg',
}
export enum RadiologyCategory {
  'Diagnostic' = 'Diagnostic',
  'Interventional' = 'Interventional',
}
export enum TestType {
  'CT' = 'CT',
  'Fluroscopy' = 'Fluroscopy',
  'MRA' = 'MRA',
  'Mammography' = 'Mammography',
  'Bone scan' = 'Bone scan',
  'Thyroid Scan' = 'Thyroid Scan',
  'Thallium cardiac' = 'Thallium cardiac',
  'X-ray' = 'X-ray',
  'PET' = 'PET',
  'Ultrasound' = 'Ultrasound',
}
export enum Quantity {
  '4 Pieces' = '4 Pieces',
}

export enum BloodGroup {
  'A+' = 'A+',
  'A-' = 'A-',
  'B+' = 'B+',
  'B-' = 'B-',
  'AB+' = 'AB+',
  'AB-' = 'AB-',
  'O+' = 'O+',
  'O-' = 'O-',
}
export enum LicenseClass {
  'A' = 'A',
  'B' = 'B',
  'C' = 'C',
  'D' = 'D',
  'E' = 'E',
  'F' = 'F',
}

export enum RadiologySpecialization {
  ComputedTomography = 'Computed Tomography',
  Fluoroscopy = 'Fluoroscopy',
  MagneticResonanceImaging = 'Magnetic Resonance Imaging',
  Mammography = 'Mammography',
  NuclearMedicine = 'Nuclear Medicine',
  Ultrasound = 'Ultrasound',
  XRay = 'X-ray',
  BoneScan = 'Bone Scan',
  ThyroidScan = 'Thyroid Scan',
  MRI = 'MRI',
  PETScan = 'PET Scan',
  ThalliumCardiac = 'Thallium Cardiac',
  TumorAblation = 'Tumor Ablation',
  Embolization = 'Embolization',
  Angiography = 'Angiography',
  Biopsy = 'Biopsy',
  Chemoembolization = 'Chemoembolization',
  Vertebroplasty = 'Vertebroplasty',
  FeedingTubePlacement = 'Feeding tube placement',
  VenousAccessCatheterization = 'Venous access catheterization',
}

export enum Cadre {
  'House Officer' = 'House Officer',
  'Medical Officer' = 'Medical Officer',
  'Registrar' = 'Registrar',
  'Senior Medical Officer' = 'Senior Medical Officer',
  'Senior Registrar' = 'Senior Registrar',
  'Principal Medical Officer' = 'Principal Medical Officer',
  'Consultant' = 'Consultant',
}

export enum Specialization {
  Cardiology = 'Cardiology',
  Radiology = 'Radiology',
  Therapist = 'Therapist',
}

export enum LaboratoryCategories {
  Allergy = 'Allergy',
  Chemistry = 'Chemistry',
  'Clinical Chemistry' = 'Clinical Chemistry',
  Coagulation = 'Coagulation',
  'Complimentary Medicine' = 'Complimentary Medicine',
  Cytogenetics = 'Cytogenetics',
  Cytopathology = 'Cytopathology',
  'Drug Monitoring' = 'Drug Monitoring',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum FacilityType {
  Pharmacy = 'Pharmacy',
  Hospital = 'Hospital',
  Laboratory = 'Laboratory',
  Radiology = 'Radiology',
  'Blood Bank' = 'Blood Bank',
}

export enum LabCategory {
  Microbiology = 'Microbiology',
}

export enum TestName {
  'Urine test' = 'Urine test',
  'Blood test' = 'Blood test',
}

export enum DiagnosticRadiology {
  CT = 'CT',
  Fluroscopy = 'Fluroscopy',
  MRA = 'MRA',
  Mammography = 'Mammography',
  'Bone scan' = 'Bone scan',
  'Thyroid Scan' = 'Thyroid Scan',
  'Thallium cardiac' = 'Thallium cardiac',
  'X-ray' = 'X-ray',
  PET = 'PET',
  Ultrasound = 'Ultrasound',
}

export enum InterventionalRadiology {
  Angiography = 'Angiography',
  Embolization = 'Embolization',
  Chemoembolization = 'Chemoembolization',
  'Tumor ablation' = 'Tumor ablation',
  'Vertebroplasty' = 'Vertebroplasty',
  Biopsy = 'Biopsy',
  'Feeding tube placement' = 'Feeding tube placement',
  'Venous access catheter' = 'Venous access catheter',
}

export enum LimitSize {
  DropDown = 1000000,
}

export enum AppNames {
  Customer = 'Customer',
  Facility = 'Facility',
  Agent = 'Agent',
  Rider = 'Rider',
}

export enum PageLayout {
  Default = 'default',
  Sidebar = 'sidebar',
  BackOffice = 'back-office',
}

export enum AdDeviceType {
  Mobile = 'Mobile',
  Tablet = 'Tablet',
  Desktop = 'Desktop',
}

export enum AdStatus {
  Draft = 'Draft',
  Approved = 'Approved',
}

export enum AppointmentCategory {
  MedicalService = 'In-house Medical Products & Services',
  Prescription = 'Prescription',
  BloodBank = 'Blood Bank',
  Diagnostic = 'Diagnostic',
  LabTest = 'Lab Test',
}

export enum ApprovalState {
  Active = 'Active',
  Rejected = 'Rejected',
  Completed = 'Completed',
}

export enum ApprovalMethod {
  Manual = 'Manual',
  Automatic = 'Automatic',
  Both = 'Both',
}
