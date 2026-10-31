import { AddPharmacist } from './add-pharmacist/add-pharmacist';
import { AllPatient } from './all-patient/all-patient';
import { PatientProfile } from './patient-profile/patient-profile';
import { PharmacyLicenseDetails } from './pharmacy-license-details/pharmacy-license-details';
import { AllPharmacist } from './all-pharmacist/all-pharmacist';
import { PharmacistDetails } from './pharmacist-details/pharmacist-details';
import { UploadPharmacistLicense } from './upload-pharmacist-license/upload-pharmacist-license';
import { ScheduleAppointmentComponent } from './schedule-appointment/schedule-appointment';
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AddVaccines } from './add-vaccines/add-vaccines';
import { AddMedicalDevices } from './add-medical-devices/add-medical-devices';
import { AddHerbalsAndNutraceuticals } from './add-herbals-and-nutraceuticals/add-herbals-and-nutraceuticals';
import { AddPatient } from './add-patient/add-patient';
import { PrescriptionSummary } from './prescription-summary/prescription-summary';
import { AddDrug } from './add-drug/add-drug';
import { Login } from './login/login';
import { ForgotPassword } from './forgot-password/forgot-password';
import { SetPassword } from './set-password/set-password';
import { VerifyOtp } from './verify-otp/verify-otp';
import { Signup } from './signup/signup';
import {
  GlucoseType,
  PostPrandial,
  WeightRecord,
  ConsultationLiveVideo,
  PreviewVideo,
  PaymentSummary,
} from '@healbridge/ui';
import { AddMedicalService } from './add-medical-service/add-medical-service';
import { Laboratory } from './laboratory/laboratory';
import { LaboratoryDetails } from './laboratory-details/laboratory-details';
import { AddDoctor } from './clinical-dashboard/add-doctor/add-doctor';
import { ViewAllDoctors } from './clinical-dashboard/view-all-doctors/view-all-doctors';
import { ViewAllNurses } from './clinical-dashboard/view-all-nurses/view-all-nurses';
import { DoctorProfile } from './clinical-dashboard/doctor-profile/doctor-profile';
import { ViewAllRecentOrders } from './clinical-dashboard/view-all-recent-orders/view-all-recent-orders';
import { ViewAllRecentPatients } from './clinical-dashboard/view-all-recent-patients/view-all-recent-patients';
import { UploadDoctorsLicense } from './clinical-dashboard/upload-doctors-license/upload-doctors-license';
import { Onboarding } from './onboarding/onboarding';
import { PharmCategory } from './pharm-category/pharm-category';
import { PharmLicense } from './pharm-license/pharm-license';
import { PharmUpload } from './pharm-upload/pharm-upload';
import { PharmEmptyBank } from './pharm-empty-bank/pharm-empty-bank';
import { PharmListBank } from './pharm-list-bank/pharm-list-bank';
import { PharmAddBank } from './pharm-add-bank/pharm-add-bank';
import { PharmProfile } from './pharm-profile/pharm-profile';
import { PharmEmptyAddress } from './pharm-empty-address/pharm-empty-address';
import { PharmAddAddress } from './pharm-add-address/pharm-add-address';
import { PharmListAddress } from './pharm-list-address/pharm-list-address';
import { PharmacistFollowUp } from './pharmacist-follow-up/pharmacist-follow-up';
import { HospitalAddBank } from './hospital-add-bank/hospital-add-bank';
import { HospitalEmptyAddress } from './hospital-empty-address/hospital-empty-address';
import { HospitalAddAddress } from './hospital-add-address/hospital-add-address';
import { HospitalUpload } from './hospital-upload/hospital-upload';
import { HospitalCategory } from './hospital-category/hospital-category';
import { HospitalEmptyBank } from './hospital-empty-bank/hospital-empty-bank';
import { HospitalLicense } from './hospital-license/hospital-license';
import { HospitalBankList } from './hospital-bank-list/hospital-bank-list';
import { HospitalAddressList } from './hospital-address-list/hospital-address-list';
import { DashboardComponent } from './dashboard.component/dashboard.component';
import { DashboardHome } from './dashboard-home/dashboard-home';
import { HospitalProfile } from './hospital-profile/hospital-profile';
import { PatientUpload } from './patient-upload/patient-upload';
import { HospitalVirtualForm } from './hospital-virtual-form/hospital-virtual-form';
import { HospitalPhysicalForm } from './hospital-physical-form/hospital-physical-form';
import { AppointmentSummaryDetails } from './appointment-summary-details/appointment-summary-details';
import { RadiologyCostRequestDetails } from './radiology-cost-request-details/radiology-cost-request-details';
import { AddPriceForRadiology } from './add-price-for-radiology/add-price-for-radiology';
import { AddPriceForBloodBank } from './add-price-for-blood-bank/add-price-for-blood-bank';
import { ViewAppointment } from './view-appointment/view-appointment';
import { LaboratoryProfile } from './laboratory-onboarding/laboratory-profile/laboratory-profile';
import { LaboratoryAddressList } from './laboratory-onboarding/laboratory-address-list/laboratory-address-list';
import { LaboratoryAddAddress } from './laboratory-onboarding/laboratory-add-address/laboratory-add-address';
import { LaboratoryEmptyAddress } from './laboratory-onboarding/laboratory-empty-address/laboratory-empty-address';
import { LaboratoryBankList } from './laboratory-onboarding/laboratory-bank-list/laboratory-bank-list';
import { LaboratoryAddBank } from './laboratory-onboarding/laboratory-add-bank/laboratory-add-bank';
import { LaboratoryEmptyBank } from './laboratory-onboarding/laboratory-empty-bank/laboratory-empty-bank';
import { LaboratoryUpload } from './laboratory-onboarding/laboratory-upload/laboratory-upload';
import { LaboratoryLicense } from './laboratory-onboarding/laboratory-license/laboratory-license';
import { LaboratoryCategory } from './laboratory-onboarding/laboratory-category/laboratory-category';
import { RadiologyProfile } from './radiology-onboarding/radiology-profile/radiology-profile';
import { RadiologyAddressList } from './radiology-onboarding/radiology-address-list/radiology-address-list';
import { RadiologyAddAddress } from './radiology-onboarding/radiology-add-address/radiology-add-address';
import { RadiologyEmptyAddress } from './radiology-onboarding/radiology-empty-address/radiology-empty-address';
import { RadiologyBankList } from './radiology-onboarding/radiology-bank-list/radiology-bank-list';
import { RadiologyAddBank } from './radiology-onboarding/radiology-add-bank/radiology-add-bank';
import { RadiologyEmptyBank } from './radiology-onboarding/radiology-empty-bank/radiology-empty-bank';
import { RadiologyUpload } from './radiology-onboarding/radiology-upload/radiology-upload';
import { RadiologyLicense } from './radiology-onboarding/radiology-license/radiology-license';
import { RadiologyCategory } from './radiology-onboarding/radiology-category/radiology-category';
import { BloodBankList } from './blood-bank-list/blood-bank-list';
import { BloodBankLicenseDetails } from './blood-bank-license-details/blood-bank-license-details';
import { BloodBankLicenseUpload } from './blood-bank-license-upload/blood-bank-license-upload';
import { BloodBankEmptyBank } from './blood-bank-empty-bank/blood-bank-empty-bank';
import { BloodBankAddBank } from './blood-bank-add-bank/blood-bank-add-bank';
import { BloodBankBankList } from './blood-bank-bank-list/blood-bank-bank-list';
import { BloodBankEmptyAddress } from './blood-bank-empty-address/blood-bank-empty-address';
import { BloodBankAddAddress } from './blood-bank-add-address/blood-bank-add-address';
import { BloodBankAddressList } from './blood-bank-address-list/blood-bank-address-list';
import { AddScientists } from './add-scientists/add-scientists';
import { AddLabTechnician } from './add-lab-technician/add-lab-technician';
import { AddRadiologist } from './add-radiologist/add-radiologist';
import { ScientistLicenseDetails } from './scientist-license-details/scientist-license-details';
import { RadiologistLicenseDetails } from './radiologist-license-details/radiologist-license-details';
import { UploadScientistLicense } from './upload-scientist-license/upload-scientist-license';
import { UploadLabTechnicianLicense } from './upload-lab-technician-license/upload-lab-technician-license';
import { UploadRadiologistLicense } from './upload-radiologist-license/upload-radiologist-license';
import { ScientistProfile } from './scientist-profile/scientist-profile';
import { LabTechnicianProfile } from './lab-technician-profile/lab-technician-profile';
import { LabTechnicianLicenseDetails } from './lab-technician-license-details/lab-technician-license-details';
import { AllRadiologist } from './all-radiologist/all-radiologist';
import { AllLabScientist } from './all-lab-scientist/all-lab-scientist';
import { AllLabTechnician } from './all-lab-technician/all-lab-technician';
import { ListAllCostRadiology } from './list-all-cost-radiology/list-all-cost-radiology';
import { ListAllCostLaboratory } from './list-all-cost-laboratory/list-all-cost-laboratory';
import { BloodBankProfile } from './blood-bank-profile/blood-bank-profile';
import { UploadProfilePicture } from './upload-profile-picture/upload-profile-picture';
import { PharmacyCostRequestDetails } from './process-request/pharmacy/pharmacy-cost-request-details/pharmacy-cost-request-details';
import { PharmacyAddCostProduct } from './process-request/pharmacy/pharmacy-add-cost-product/pharmacy-add-cost-product';
import { AddDrugForm } from './process-request/pharmacy/add-drug-form/add-drug-form';
import { RadiologistProfile } from './radiologist-profile/radiologist-profile';
import { AddRequestItems } from './process-request/pharmacy-without-attachment/add-request-items/add-request-items';
import { RequestItemDetails } from './process-request/pharmacy-without-attachment/request-item-details/request-item-details';
import { AddLabTest } from './process-request/labTest-without-attachment/add-lab-test/add-lab-test';
import { AttachementAllRequestLabTest } from './process-request/labTest-with-attachment/attachement-all-request-lab-test/attachement-all-request-lab-test';
import { AddRadiologyTest } from './process-request/radiology/add-radiology-test/add-radiology-test';
import { RadiologyWithAttachmentAllRequest } from './process-request/radiology/radiology-with-attachment-all-request/radiology-with-attachment-all-request';
import { AddBbTest } from './add-bb-test/add-bb-test';
import { AttachBbTest } from './attach-bb-test/attach-bb-test';
import { SelectAddress } from './select-address/select-address';
import { AssignDoctorToAppointment } from './assign-doctor-to-appointment/assign-doctor-to-appointment';
import { DoctorDashboard } from './doctor-dashboard/doctor-dashboard';
import { DoctorAvailableHospital } from './doctor-available-hospital/doctor-available-hospital';
import { DoctorAvailableInvitation } from './doctor-available-invitation/doctor-available-invitation';
import { DoctorAvailableAppointments } from './doctor-available-appointments/doctor-available-appointments';
import { DoctorHome } from './doctor-home/doctor-home';
import { MedicalFacilityAddTemperature } from './medical-facility-add-temperature/medical-facility-add-temperature';
import { MedicalFacilityAddBp } from './medical-facility-add-bp/medical-facility-add-bp';
import { MedicalFacilityAddWeight } from './medical-facility-add-weight/medical-facility-add-weight';
import { MedicalFacilityAddHeight } from './medical-facility-add-height/medical-facility-add-height';
import { MedicalFacilityAddOxygenSaturation } from './medical-facility-add-oxygen-saturation/medical-facility-add-oxygen-saturation';
import { DoctorProfilePage } from './doctor-profile-page/doctor-profile-page';
import { MedicalFacilityAddFasting } from './medical-facility-add-fasting/medical-facility-add-fasting';
import { MedicalFacilityAddRandom } from './medical-facility-add-random/medical-facility-add-random';
import { MedicalFacilityAddPostPrandial } from './medical-facility-add-post-prandial/medical-facility-add-post-prandial';
import { MedicalFacilityAddOgtt } from './medical-facility-add-ogtt/medical-facility-add-ogtt';
import { HospitalPatientCardTypes } from './hospital-patient-card-types/hospital-patient-card-types';
import { HospitalAddPatientCardType } from './hospital-add-patient-card-type/hospital-add-patient-card-type';
import { ListAllProfessionalAppointmentRequests } from './list-all-professional-appointment-requests/list-all-professional-appointment-requests';
import { AcceptProfessionalRequest } from './accept-professional-request/accept-professional-request';
import { ListAllMedicalFacilityAppointments } from './list-all-medical-facility-appointments/list-all-medical-facility-appointments';
import { MedicalDashboardMore } from './medical-dashboard-more/medical-dashboard-more';
import { AddDoctorLicense } from './add-doctor-license/add-doctor-license';
import { OrderDetails } from './order-details/order-details';
import { ConfirmDispatchPin } from './confirm-dispatch-pin/confirm-dispatch-pin';
import { AppointmentVideoCallDoctor } from './appointment-video-call-doctor/appointment-video-call-doctor';
import { AuthGuard } from '@healbridge/shared';
import { AddDoctorBank } from './add-doctor-bank/add-doctor-bank';
import { MedWalletHistory } from './med-wallet-history/med-wallet-history';
import { MedWalletWithdrawal } from './med-wallet-withdrawal/med-wallet-withdrawal';
import { MedValidateOtp } from './med-validate-otp/med-validate-otp';
import { DoctorWalletHistory } from './doctor-wallet-history/doctor-wallet-history';
import { DoctorWalletWithdrawal } from './doctor-wallet-withdrawal/doctor-wallet-withdrawal';
import { DoctorValidateOtp } from './doctor-validate-otp/doctor-validate-otp';
import { DoctorCreditOrDebitDetails } from './doctor-credit-or-debit-details/doctor-credit-or-debit-details';
import { ListAllInvites } from './list-all-invites/list-all-invites';
import { ViewAllMedicalService } from './view-all-medical-service/view-all-medical-service';
import { DoctorViewInvite } from './doctor-view-invite/doctor-view-invite';
import { AddNurse } from './add-nurse/add-nurse';
import { NurseDashboard } from './nurse-dashboard/nurse-dashboard';
import { NurseHome } from './nurse-home/nurse-home';
import { NurseAppointments } from './nurse-appointments/nurse-appointments';
import { NurseProfile } from './nurse-profile/nurse-profile';
import { NurseDetails } from './nurse-details/nurse-details';
import { NurseAvailableInvitation } from './nurse-available-invitation/nurse-available-invitation';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: Signup,
  },

  {
    path: 'signup/:referralCode',
    component: Signup,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'set-password',
    component: SetPassword,
  },
  {
    path: 'set-password/:facilityId',
    component: SetPassword,
  },
  {
    path: 'verify-otp/:email/:module',
    component: VerifyOtp,
  },
  {
    path: 'verify-otp/:email/:module/:facilityId',
    component: VerifyOtp,
  },

  {
    path: 'add-pharmacist/:professionalId',
    component: AddPharmacist,
  },
  {
    path: 'lab-technician-license-details/:facilityType/:facilityId/:professionalId',
    component: LabTechnicianLicenseDetails,
  },
  {
    path: 'scientist-license-details/:facilityType/:facilityId/:professionalId',
    component: ScientistLicenseDetails,
  },

  {
    path: 'radiologist-license-details/:facilityType/:facilityId/:professionalId',
    component: RadiologistLicenseDetails,
  },

  {
    path: 'radiology-profile/:facilityType/:facilityId/:professionalId',
    component: RadiologyProfile,
  },

  {
    path: 'scientist-license-upload/:facilityType/:facilityId/:professionalId',
    component: UploadScientistLicense,
  },
  {
    path: 'lab-technician-license-upload/:facilityType/:facilityId/:professionalId',
    component: UploadLabTechnicianLicense,
  },

  {
    path: 'radiologist-license-upload/:facilityType/:facilityId/:professionalId',
    component: UploadRadiologistLicense,
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: DashboardHome,
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./notification/notification').then((m) => m.Notification),
      },
      {
        path: ':facilityType/wallet-history/:facilityId',
        component: MedWalletHistory,
      },
      {
        path: 'wallet-withdrawal',
        component: MedWalletWithdrawal,
      },
      {
        path: ':withdrawalId/wallet-withdraw-otp/:facilityType/:facilityId',
        component: MedValidateOtp,
      },
      {
        path: 'wallet-transaction-type/:flowId/:facilityType/:facilityId',
        loadComponent: () =>
          import('./credit-or-debit-details/credit-or-debit-details').then(
            (m) => m.CreditOrDebitDetails
          ),
      },

      {
        path: 'request',
        component: ListAllCostLaboratory,
      },
      {
        path: 'add-nurse/:facilityType/:facilityId',
        component: AddNurse,
      },
      {
        path: 'add-nurse/:facilityType/:facilityId/:professionalId/:edit',
        component: AddNurse,
      },
      {
        path: 'add-doctor/:facilityType/:facilityId',
        component: AddDoctor,
      },
      {
        path: 'onboarding/:facilityId',
        component: Onboarding,
      },
      {
        path: 'pharmacy-onboarding/:facilityId/:pharmacyId',
        children: [
          {
            path: '',
            component: PharmCategory,
          },
          {
            path: 'pharm-category',
            component: PharmCategory,
          },
          {
            path: 'pharm-category/:edit',
            component: PharmCategory,
          },
          {
            path: 'pharm-license',
            component: PharmLicense,
          },
          {
            path: 'pharm-upload',
            component: PharmUpload,
          },
          {
            path: 'pharm-license/:edit/:licenseId',
            component: PharmLicense,
          },
          {
            path: 'pharm-upload/:edit',
            component: PharmUpload,
          },
          {
            path: 'pharm-empty-bank',
            component: PharmEmptyBank,
          },
          {
            path: 'pharm-add-bank',
            component: PharmAddBank,
          },
          {
            path: 'pharm-bank-list',
            component: PharmListBank,
          },
          {
            path: 'pharm-add-bank/:edit/:bankAccountId',
            component: PharmAddBank,
          },
          {
            path: 'pharm-empty-address',
            component: PharmEmptyAddress,
          },
          {
            path: 'pharm-empty-address/:patch',
            component: PharmEmptyAddress,
          },
          {
            path: 'pharm-add-address',
            component: PharmAddAddress,
          },
          {
            path: 'pharm-address-list',
            component: PharmListAddress,
          },

          {
            path: 'pharm-add-address/:edit/:addressId',
            component: PharmAddAddress,
          },
          {
            path: '',
            redirectTo: 'pharm-category',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'hospital-onboarding/:facilityId/:pharmacyId',
        children: [
          {
            path: '',
            component: HospitalCategory,
          },
          {
            path: 'hospital-category',
            component: HospitalCategory,
          },
          {
            path: 'hospital-category/:edit',
            component: HospitalCategory,
          },
          {
            path: 'hospital-license',
            component: HospitalLicense,
          },
          {
            path: 'hospital-upload',
            component: HospitalUpload,
          },
          {
            path: 'hospital-license/:edit/:licenseId',
            component: HospitalLicense,
          },
          {
            path: 'hospital-upload/:edit',
            component: HospitalUpload,
          },
          {
            path: 'hospital-empty-bank',
            component: HospitalEmptyBank,
          },
          {
            path: 'hospital-add-bank',
            component: HospitalAddBank,
          },
          {
            path: 'hospital-bank-list',
            component: HospitalBankList,
          },
          {
            path: 'hospital-add-bank/:edit/:bankAccountId',
            component: HospitalAddBank,
          },
          {
            path: 'hospital-empty-address',
            component: HospitalEmptyAddress,
          },
          {
            path: 'hospital-empty-address/:patch',
            component: HospitalEmptyAddress,
          },
          {
            path: 'hospital-add-address',
            component: HospitalAddAddress,
          },
          {
            path: 'hospital-address-list',
            component: HospitalAddressList,
          },

          {
            path: 'hospital-add-address/:edit/:addressId',
            component: HospitalAddAddress,
          },
          {
            path: 'hospital-patient-card-types',
            component: HospitalPatientCardTypes,
          },
          {
            path: 'hospital-add-patient-card-type',
            component: HospitalAddPatientCardType,
          },
          {
            path: 'hospital-add-patient-card-type/:new',
            component: HospitalAddPatientCardType,
          },
          {
            path: 'hospital-add-patient-card-type/:edit/:patientCardTypeId',
            component: HospitalAddPatientCardType,
          },
          {
            path: '',
            redirectTo: 'hospital-category',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'laboratory-onboarding/:facilityId/:laboratoryId',
        children: [
          {
            path: '',
            component: LaboratoryCategory,
          },
          {
            path: 'laboratory-category',
            component: LaboratoryCategory,
          },
          {
            path: 'laboratory-category/:edit',
            component: LaboratoryCategory,
          },
          {
            path: 'laboratory-license',
            component: LaboratoryLicense,
          },
          {
            path: 'laboratory-upload',
            component: LaboratoryUpload,
          },
          {
            path: 'laboratory-license/:edit/:licenseId',
            component: LaboratoryLicense,
          },
          {
            path: 'laboratory-upload/:edit',
            component: LaboratoryUpload,
          },
          {
            path: 'laboratory-empty-bank',
            component: LaboratoryEmptyBank,
          },
          {
            path: 'laboratory-add-bank',
            component: LaboratoryAddBank,
          },
          {
            path: 'laboratory-bank-list',
            component: LaboratoryBankList,
          },
          {
            path: 'laboratory-add-bank/:edit/:bankAccountId',
            component: LaboratoryAddBank,
          },
          {
            path: 'laboratory-empty-address',
            component: LaboratoryEmptyAddress,
          },
          {
            path: 'laboratory-empty-address/:patch',
            component: LaboratoryEmptyAddress,
          },
          {
            path: 'laboratory-add-address',
            component: LaboratoryAddAddress,
          },
          {
            path: 'laboratory-address-list',
            component: LaboratoryAddressList,
          },

          {
            path: 'laboratory-add-address/:edit/:addressId',
            component: LaboratoryAddAddress,
          },
          {
            path: '',
            redirectTo: 'laboratory-category',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'blood-bank-onboarding/:facilityId/:bloodBankId',
        children: [
          {
            path: '',
            component: BloodBankList,
          },
          {
            path: 'blood-bank-list',
            component: BloodBankList,
          },
          {
            path: 'blood-bank-list/:edit',
            component: BloodBankList,
          },
          {
            path: 'blood-bank-license-details',
            component: BloodBankLicenseDetails,
          },
          {
            path: 'blood-bank-license-details/:edit/:licenseId',
            component: BloodBankLicenseDetails,
          },
          {
            path: 'blood-bank-license-upload',
            component: BloodBankLicenseUpload,
          },
          {
            path: 'blood-bank-empty-bank',
            component: BloodBankEmptyBank,
          },
          {
            path: 'blood-bank-add-bank',
            component: BloodBankAddBank,
          },
          {
            path: 'blood-bank-add-bank/:edit/:bankAccountId',
            component: BloodBankAddBank,
          },
          {
            path: 'blood-bank-bank-list',
            component: BloodBankBankList,
          },
          {
            path: 'blood-bank-empty-address',
            component: BloodBankEmptyAddress,
          },
          {
            path: 'blood-bank-empty-address/:patch',
            component: BloodBankEmptyAddress,
          },
          {
            path: 'blood-bank-add-address',
            component: BloodBankAddAddress,
          },
          {
            path: 'blood-bank-add-address/:edit/:addressId',
            component: BloodBankAddAddress,
          },
          {
            path: 'blood-bank-address-list',
            component: BloodBankAddressList,
          },

          {
            path: '',
            redirectTo: 'blood-bank-list',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'radiology-onboarding/:facilityId/:pharmacyId',
        children: [
          {
            path: '',
            component: RadiologyCategory,
          },
          {
            path: 'radiology-category',
            component: RadiologyCategory,
          },
          {
            path: 'radiology-category/:edit',
            component: RadiologyCategory,
          },
          {
            path: 'radiology-license',
            component: RadiologyLicense,
          },
          {
            path: 'radiology-upload',
            component: RadiologyUpload,
          },
          {
            path: 'radiology-license/:edit/:licenseId',
            component: RadiologyLicense,
          },
          {
            path: 'radiology-upload/:edit',
            component: RadiologyUpload,
          },
          {
            path: 'radiology-empty-bank',
            component: RadiologyEmptyBank,
          },
          {
            path: 'radiology-add-bank',
            component: RadiologyAddBank,
          },
          {
            path: 'radiology-bank-list',
            component: RadiologyBankList,
          },
          {
            path: 'radiology-add-bank/:edit/:bankAccountId',
            component: RadiologyAddBank,
          },
          {
            path: 'radiology-empty-address',
            component: RadiologyEmptyAddress,
          },
          {
            path: 'radiology-empty-address/:patch',
            component: RadiologyEmptyAddress,
          },
          {
            path: 'radiology-add-address',
            component: RadiologyAddAddress,
          },
          {
            path: 'radiology-address-list',
            component: RadiologyAddressList,
          },

          {
            path: 'radiology-add-address/:edit/:addressId',
            component: RadiologyAddAddress,
          },
          {
            path: '',
            redirectTo: 'radiology-category',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'add-doctor-license/:facilityType/:facilityId/:professionalId/:step/:isNew',
        component: AddDoctorLicense,
      },
      {
        path: 'add-doctor/:facilityType/:facilityId/:professionalId',
        component: AddDoctor,
      },
      {
        path: 'add-doctor/:facilityType/:facilityId/:professionalId/:edit',
        component: AddDoctor,
      },
      {
        path: 'add-doctor-license/:facilityType/:facilityId/:professionalId/:edit',
        component: AddDoctorLicense,
      },
      {
        path: 'upload-license/:facilityType/:facilityId/:professionalId',
        component: UploadDoctorsLicense,
      },
      {
        path: 'doctor-profile/:facilityType/:facilityId/:professionalId',
        component: DoctorProfile,
      },
      {
        path: 'nurse-profile/:facilityType/:facilityId/:professionalId',
        component: NurseDetails,
      },
      {
        path: 'more/:facilityType/:facilityId/:categoryId',
        component: MedicalDashboardMore,
      },
      {
        path: 'more/:facilityType/:facilityId/:categoryId/list-all-invites',
        component: ListAllInvites,
      },
      {
        path: 'more/:facilityType/:facilityId/:categoryId/view-all-medical-service',
        component: ViewAllMedicalService,
      },
      {
        path: 'more/:facilityType/:facilityId/:categoryId/add-medical-service',
        component: AddMedicalService,
      },
      {
        path: 'add-pharmacist/:facilityType/:facilityId',
        component: AddPharmacist,
      },
      {
        path: 'scientist-license-details/:facilityType/:facilityId/:professionalId',
        component: ScientistLicenseDetails,
      },

      {
        path: 'pharmacist-license-details/:facilityType/:facilityId/:professionalId',
        component: PharmacyLicenseDetails,
      },
      {
        path: 'radiologist-license-details/:facilityType/:facilityId/:professionalId',
        component: RadiologistLicenseDetails,
      },
      {
        path: 'radiologist-license-upload/:facilityType/:facilityId/:professionalId',
        component: UploadRadiologistLicense,
      },
      {
        path: 'pharmacist-license-details/:facilityType/:facilityId/:professionalId/:licenseId',
        component: PharmacyLicenseDetails,
      },
      {
        path: 'lab-technician-license-details/:facilityType/:facilityId/:professionalId/:licenseId',
        component: PharmacyLicenseDetails,
      },
      {
        path: 'radiologist-license-details/:facilityType/:facilityId/:professionalId/:licenseId',
        component: RadiologistLicenseDetails,
      },
      {
        path: 'pharmacist-license-upload/:facilityType/:facilityId/:professionalId',
        component: UploadPharmacistLicense,
      },
      {
        path: 'pharmacist-profile/:facilityType/:facilityId/:professionalId',
        component: PharmacistDetails,
      },
      {
        path: 'add-scientist/:facilityType/:facilityId',
        component: AddScientists,
      },
      {
        path: 'pharm-profile/:facilityId/:pharmacyId',
        component: PharmProfile,
      },
      {
        path: 'hospital-profile/:facilityId/:pharmacyId',
        component: HospitalProfile,
      },
      {
        path: 'laboratory-profile/:facilityId/:laboratoryId',
        component: LaboratoryProfile,
      },
      {
        path: 'blood-bank-profile/:facilityId/:bloodBankId',
        component: BloodBankProfile,
      },
      {
        path: 'add-lab-technician/:facilityType/:facilityId',
        component: AddLabTechnician,
      },
      {
        path: 'add-radiologist/:facilityType/:facilityId',
        component: AddRadiologist,
      },
      {
        path: 'radiologist-profile/:facilityType/:facilityId/:professionalId',
        component: RadiologistProfile,
      },
      {
        path: 'radiology-profile/:facilityId/:radiologyId',
        component: RadiologyProfile,
      },
      {
        path: 'scientist-license-upload/:facilityType/:facilityId/:professionalId',
        component: UploadScientistLicense,
      },
      {
        path: 'add-radiologist/:facilityType/:facilityId/:professionalId',
        component: AddRadiologist,
      },
      {
        path: 'add-pharmacist/:facilityType/:facilityId/:professionalId',
        component: AddPharmacist,
      },
      {
        path: 'scientist-profile/:facilityType/:facilityId/:professionalId',
        component: ScientistProfile,
      },
      {
        path: 'add-scientist/:facilityType/:facilityId/:professionalId',
        component: AddScientists,
      },
      {
        path: 'pharm-profile/:facilityId/:pharmacyId/upload-profile-picture',
        component: UploadProfilePicture,
      },

      {
        path: 'hospital-profile/:facilityId/:pharmacyId/upload-profile-picture',
        component: UploadProfilePicture,
      },

      {
        path: 'laboratory-profile/:facilityId/:laboratoryId/upload-profile-picture',
        component: UploadProfilePicture,
      },

      {
        path: 'radiology-profile/:facilityId/:radiologyId/upload-profile-picture',
        component: UploadProfilePicture,
      },
      {
        path: 'blood-bank-profile/:facilityId/:bloodBankId/upload-profile-picture',
        component: UploadProfilePicture,
      },

      {
        path: 'pharmacist-profile/:facilityType/:facilityId/:professionalId/upload-profile-picture',
        component: UploadProfilePicture,
      },
      {
        path: 'doctor-profile/:facilityType/:facilityId/:professionalId/upload-profile-picture',
        component: UploadProfilePicture,
      },
      {
        path: 'nurse-profile/:facilityType/:facilityId/:professionalId/upload-profile-picture',
        component: UploadProfilePicture,
      },
      {
        path: 'lab-technician-profile/:facilityType/:facilityId/:professionalId/upload-profile-picture',
        component: UploadProfilePicture,
      },
      {
        path: 'pharm-profile/:facilityId/:pharmacyId/upload-profile-picture',
        component: UploadProfilePicture,
      },
      {
        path: 'radiologist-profile/:facilityType/:facilityId/:professionalId/upload-profile-picture',
        component: UploadProfilePicture,
      },
      {
        path: 'scientist-profile/:facilityType/:facilityId/:professionalId/upload-profile-picture',
        component: UploadProfilePicture,
      },
      {
        path: 'lab-technician-profile/:facilityType/:facilityId/:professionalId',
        component: LabTechnicianProfile,
      },
      {
        path: 'add-lab-technician/:facilityType/:facilityId/:professionalId',
        component: AddLabTechnician,
      },
      {
        path: 'all-pharmacist',
        component: AllPharmacist,
      },
      {
        path: 'pharms',
        component: AllPharmacist,
      },
      {
        path: 'all-radiologist',
        component: AllRadiologist,
      },
      {
        path: 'radiologystaff',
        component: AllRadiologist,
      },
      {
        path: 'labstaffs',
        component: AllLabScientist,
      },
      {
        path: 'bbstaff',
        component: AllLabTechnician,
      },
      {
        path: 'doctors',
        component: ViewAllDoctors,
      },
      {
        path: 'nurses',
        component: ViewAllNurses,
      },
      {
        path: 'orders',
        component: ViewAllRecentOrders,
      },
      {
        path: 'order-details/:fulfilmentId/:facilityType/:facilityTypeId',
        component: OrderDetails,
      },
      {
        path: 'confirm-dispatch-pin/:orderId/:fulfilmentId/:facilityType/:facilityTypeId',
        component: ConfirmDispatchPin,
      },
      {
        path: 'doctor-recent-patients',
        component: ViewAllRecentPatients,
      },
      {
        path: 'patients',
        component: AllPatient,
      },
      {
        path: 'add-patient/:facilityType/:facilityId/:facilityTypeId',
        component: AddPatient,
      },
      {
        path: 'patient-upload/:facilityType/:facilityId/:facilityTypeId/:patientId',
        component: PatientUpload,
      },
      {
        path: 'assign-doctor-to-appointment/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: AssignDoctorToAppointment,
      },
      {
        path: 'list-all-medical-facility-appointments/:facilityType/:facilityId/:facilityTypeId',
        component: ListAllMedicalFacilityAppointments,
      },
      {
        path: 'list-all-medical-facility-appointments/:facilityType/:facilityId/:facilityTypeId/:appointmentStatus',
        component: ListAllMedicalFacilityAppointments,
      },
      {
        path: 'patient-profile/:facilityType/:facilityId/:facilityTypeId/:memberId',
        component: PatientProfile,
      },
      {
        path: 'prescription-summary',
        component: PrescriptionSummary,
      },
      {
        path: 'add-bp/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: MedicalFacilityAddBp,
      },

      {
        path: 'add-temperature/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: MedicalFacilityAddTemperature,
      },

      {
        path: 'glucose-type/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: GlucoseType,
      },

      {
        path: 'add-Fasting/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: MedicalFacilityAddFasting,
      },

      {
        path: 'add-Random/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: MedicalFacilityAddRandom,
      },

      {
        path: 'add-Post-Prandial/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: MedicalFacilityAddPostPrandial,
      },

      {
        path: 'add-OGTT/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: MedicalFacilityAddOgtt,
      },

      {
        path: 'add-weight/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: MedicalFacilityAddWeight,
      },

      {
        path: 'add-height/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: MedicalFacilityAddHeight,
      },

      {
        path: 'add-oxygen-saturation/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: MedicalFacilityAddOxygenSaturation,
      },
      {
        path: 'add-drug/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: AddDrug,
      },
      {
        path: 'add-medical-service-appointment/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: AddMedicalService,
      },
      {
        path: 'edit-medical-service-appointment/:facilityType/:facilityId/:facilityTypeId/:referralId',
        component: AddMedicalService,
      },
      {
        path: 'edit-drug/:facilityType/:facilityId/:facilityTypeId/:referralId',
        component: AddDrug,
      },
      {
        path: 'add-vaccines/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: AddVaccines,
      },
      {
        path: 'edit-vaccines/:facilityType/:facilityId/:facilityTypeId/:referralId',
        component: AddVaccines,
      },

      {
        path: 'add-medical-devices/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: AddMedicalDevices,
      },
      {
        path: 'edit-medical-devices/:facilityType/:facilityId/:facilityTypeId/:referralId',
        component: AddMedicalDevices,
      },
      {
        path: 'add-herbals-and-nutraceuticals/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: AddHerbalsAndNutraceuticals,
      },
      {
        path: 'edit-herbals-and-nutraceuticals/:facilityType/:facilityId/:facilityTypeId/:referralId',
        component: AddHerbalsAndNutraceuticals,
      },

      {
        path: 'hospital-virtual-form',
        component: HospitalVirtualForm,
      },
      {
        path: 'hospital-physical-form',
        component: HospitalPhysicalForm,
      },
      {
        path: 'appointment-summary-details',
        component: AppointmentSummaryDetails,
      },

      {
        path: 'select-address/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/select-address',
        loadComponent: () =>
          import('./select-address/select-address').then(
            (m) => m.SelectAddress
          ),
      },
      {
        path: 'select-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/select-address/:whoGoes/:professionalSendCost/:appointmentId',
        loadComponent: () =>
          import('./select-address/select-address').then(
            (m) => m.SelectAddress
          ),
      },
      {
        path: 'select-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/select-address/:whoGoes/:professionalSendCost/:appointmentId/:facilityId',
        loadComponent: () =>
          import('./select-address/select-address').then(
            (m) => m.SelectAddress
          ),
      },
      {
        path: 'select-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/select-address/:professionalId/:whoGoes/:professionalSendCost/:appointmentId',
        loadComponent: () =>
          import('./select-address/select-address').then(
            (m) => m.SelectAddress
          ),
      },
      {
        path: 'pharmacy-cost-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId',
        component: PharmacyCostRequestDetails,
      },
      {
        path: 'pharmacy-cost-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId/add-drug-form/:greenBook',
        component: AddDrugForm,
      },

      {
        path: 'pharmacy-cost-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId/:greenBook/:ingredientId',
        component: PharmacyAddCostProduct,
      },

      {
        path: 'no-attachment-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId',
        component: PharmacyCostRequestDetails,
      },
      {
        path: 'no-attachment-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId/add-request-item/:greenBook',
        component: AddRequestItems,
      },
      {
        path: 'no-attachment-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/add-address-no-attach',
        component: SelectAddress,
      },

      {
        path: 'no-attachment-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId/:greenBook/:ingredientId',
        component: RequestItemDetails,
      },

      {
        path: 'no-attach-bb/:facilityType/:facilityId/:serviceRequestId/:memberId',
        component: AttachBbTest,
      },
      {
        path: 'attach-bb/:facilityType/:facilityId/:serviceRequestId/:memberId',
        component: AttachBbTest,
      },

      {
        path: 'add-bb-test/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/add-bb-no-attach/:serviceName/:bloodGroup/:quantity',
        component: AddBbTest,
      },
      {
        path: 'add-bb-test/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/add-bb-test-attach',
        component: AddBbTest,
      },
      {
        path: 'add-bb-test/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/add-bb-test-attach/:costingId',
        component: AddBbTest,
      },

      {
        path: 'no-attach-bb/:facilityType/:facilityId/:serviceRequestId/:memberId/no-bb-test-attach',
        component: AttachBbTest,
      },

      {
        path: 'no-attachment-labtest-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId',
        component: AttachementAllRequestLabTest,
      },

      {
        path: 'attach-lt/:facilityType/:facilityId/:serviceRequestId/:memberId',
        component: AttachementAllRequestLabTest,
      },

      {
        path: 'attachment-labtest-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/add-lab-test-attachment',
        component: AddLabTest,
      },
      {
        path: 'attachment-labtest-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/add-lab-test-no-attachment/:testName/:testGroup',
        component: AddLabTest,
      },

      {
        path: 'attachment-labtest-request-details/:facilityType/:facilityId/:serviceRequestId/:memberId',
        component: AttachementAllRequestLabTest,
      },

      {
        path: 'no-attach-radiology/:facilityType/:facilityId/:serviceRequestId/:memberId',
        component: RadiologyWithAttachmentAllRequest,
      },

      {
        path: 'no-attach-radiology/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/add-radiology-without-attachment/:serviceName',
        component: AddRadiologyTest,
      },

      {
        path: 'attach-radiology/:facilityType/:facilityId/:serviceRequestId/:memberId',
        component: RadiologyWithAttachmentAllRequest,
      },

      {
        path: 'attach-radiology/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/add-radiology-with-attachment',
        component: AddRadiologyTest,
      },
      {
        path: 'attach-radiology/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/add-radiology-with-attachment/:costingId',
        component: AddRadiologyTest,
      },

      {
        path: 'radiology-cost-request-details',
        component: RadiologyCostRequestDetails,
      },
      {
        path: 'add-price-for-radiology',
        component: AddPriceForRadiology,
      },
      {
        path: 'add-price-for-blood-bank',
        component: AddPriceForBloodBank,
      },
      {
        path: 'schedule-appointment/:facilityType/:facilityId/:facilityTypeId/:memberId',
        component: ScheduleAppointmentComponent,
      },
      {
        path: 'view-appointment/:facilityType/:facilityId/:facilityTypeId/:appointmentId/:memberId',
        component: ViewAppointment,
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'add-address/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/new-address',
    loadComponent: () =>
      import('./new-address/new-address').then((m) => m.NewAddress),
  },
  {
    path: 'add-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/new-address/:professionalId/:whoGoes/:professionalSendCost/:referenceDocumentId/:appointmentId',
    loadComponent: () =>
      import('./new-address/new-address').then((m) => m.NewAddress),
  },
  {
    path: 'add-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/new-address/:whoGoes/:professionalSendCost/:referenceDocumentId/:appointmentId',
    loadComponent: () =>
      import('./new-address/new-address').then((m) => m.NewAddress),
  },
  {
    path: 'add-address/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/new-address/:whoGoes/:professionalSendCost/:referenceDocumentId/:appointmentId',
    loadComponent: () =>
      import('./new-address/new-address').then((m) => m.NewAddress),
  },
  {
    path: 'dashboard/payment-summary',
    component: PaymentSummary,
  },
  {
    path: 'laboratory',
    component: Laboratory,
  },
  {
    path: 'laboratory-details',
    component: LaboratoryDetails,
  },
  {
    path: 'consultation-live-video',
    component: ConsultationLiveVideo,
  },
  {
    path: 'follow-up-request',
    component: PharmacistFollowUp,
  },
  {
    path: 'preview-video',
    component: PreviewVideo,
  },
  {
    path: 'list-all-cost/radiology',
    component: ListAllCostRadiology,
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
 {
  path: '',
  component: NurseDashboard,
  canActivate: [AuthGuard],
  children: [
    {
      path: 'nurse-dashboard/:professionalId',
      children: [
        { path: '', pathMatch: 'full', component: NurseHome },
        {
          path: 'notifications',
          loadComponent: () =>
            import('./notification/notification').then((m) => m.Notification),
        },
        { path: 'nurse-appointments', component: NurseAppointments },
        {
          path: 'view-appointment/:appointmentId/:memberId',
          component: ViewAppointment,
        },
        {
          path: 'add-bp/:appointmentId/:memberId',
          component: MedicalFacilityAddBp,
        },
        {
          path: 'add-temperature/:appointmentId/:memberId',
          component: MedicalFacilityAddTemperature,
        },
        {
          path: 'glucose-type/:appointmentId/:memberId',
          component: GlucoseType,
        },
        {
          path: 'add-Fasting/:appointmentId/:memberId',
          component: MedicalFacilityAddFasting,
        },
        {
          path: 'add-Random/:appointmentId/:memberId',
          component: MedicalFacilityAddRandom,
        },
        {
          path: 'add-OGTT/:appointmentId/:memberId',
          component: MedicalFacilityAddOgtt,
        },
        {
          path: 'add-Post-Prandial/:appointmentId/:memberId',
          component: MedicalFacilityAddPostPrandial,
        },
        {
          path: 'add-weight/:appointmentId/:memberId',
          component: MedicalFacilityAddWeight,
        },
        {
          path: 'add-height/:appointmentId/:memberId',
          component: MedicalFacilityAddHeight,
        },
        {
          path: 'add-oxygen-saturation/:appointmentId/:memberId',
          component: MedicalFacilityAddOxygenSaturation,
        },
        {
          path: 'nurse-drug-prescription/:appointmentId/:memberId',
          component: AddDrug,
        },
        {
          path: 'nurse-add-medical-service/:facilityTypeId/:appointmentId/:memberId',
          component: AddMedicalService,
        },
        {
          path: 'nurse-edit-medical-service/:facilityTypeId/:referralId',
          component: AddMedicalService,
        },
        {
          path: 'edit-drugs/:referralId',
          component: AddDrug,
        },
        {
          path: 'nurse-vaccines-prescription/:appointmentId/:memberId',
          component: AddVaccines,
        },
        {
          path: 'edit-vaccines/:referralId',
          component: AddVaccines,
        },
        {
          path: 'add-medical-devices/:appointmentId/:memberId',
          component: AddMedicalDevices,
        },
        {
          path: 'edit-medical-devices/:referralId',
          component: AddMedicalDevices,
        },
        {
          path: 'add-herbals-and-nutraceuticals/:appointmentId/:memberId',
          component: AddHerbalsAndNutraceuticals,
        },
        {
          path: 'edit-herbals-and-nutraceuticals/:referralId',
          component: AddHerbalsAndNutraceuticals,
        },
        {
          path: 'nurse-available-invitations',
          component: NurseAvailableInvitation,
        },
        { path: 'patients', component: AllPatient },
        { path: 'doctors', component: ViewAllDoctors },
        {
          path: 'doctor-profile/:doctorId',
          component: DoctorProfile,
        },
        {
          path: 'patient-profile/:facilityId/:facilityTypeId/:memberId',
          component: PatientProfile,
        },
        {
          path: 'schedule-appointment/:facilityId/:facilityTypeId/:memberId',
          component: ScheduleAppointmentComponent,
        },
        {
          path: 'assign-doctor-to-appointment/:facilityTypeId/:appointmentId/:memberId',
          component: AssignDoctorToAppointment,
        },
        { path: 'nurse-profile', component: NurseProfile },
          {
            path: 'edit-nurse/:edit',
            component: AddNurse,
          },
        { path: 'nurse-details', component: NurseDetails },
        {
          path: 'nurse-profile/upload-profile-picture',
          component: UploadProfilePicture,
        },
      ],
    },
  ],
},
  {
    path: '',
    component: DoctorDashboard,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'doctor-dashboard/:professionalId',
        children: [
          { path: '', pathMatch: 'full', component: DoctorHome },
          {
            path: 'notifications',
            loadComponent: () =>
              import('./notification/notification').then((m) => m.Notification),
          },
          {
            path: 'doctor-drug-prescription/:appointmentId/:memberId',
            component: AddDrug,
          },
          {
            path: 'doctor-add-medical-service/:facilityTypeId/:appointmentId/:memberId',
            component: AddMedicalService,
          },
          {
            path: 'doctor-edit-medical-service/:facilityTypeId/:referralId',
            component: AddMedicalService,
          },
          {
            path: 'add-bp/:appointmentId/:memberId',
            component: MedicalFacilityAddBp,
          },
          {
            path: 'add-Fasting/:appointmentId/:memberId',
            component: MedicalFacilityAddFasting,
          },
          {
            path: 'add-Random/:appointmentId/:memberId',
            component: MedicalFacilityAddRandom,
          },
          {
            path: 'add-OGTT/:appointmentId/:memberId',
            component: MedicalFacilityAddOgtt,
          },
          {
            path: 'add-Post-Prandial/:appointmentId/:memberId',
            component: MedicalFacilityAddPostPrandial,
          },
          {
            path: 'add-temperature/:appointmentId/:memberId',
            component: MedicalFacilityAddTemperature,
          },
          {
            path: 'glucose-type/:appointmentId/:memberId',
            component: GlucoseType,
          },
          {
            path: 'add-weight/:appointmentId/:memberId',
            component: MedicalFacilityAddWeight,
          },
          {
            path: 'add-height/:appointmentId/:memberId',
            component: MedicalFacilityAddHeight,
          },
          {
            path: 'add-oxygen-saturation/:appointmentId/:memberId',
            component: MedicalFacilityAddOxygenSaturation,
          },
          {
            path: 'edit-drugs/:referralId',
            component: AddDrug,
          },
          {
            path: 'add-address/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/new-address',
            loadComponent: () =>
              import('./new-address/new-address').then((m) => m.NewAddress),
          },
          {
            path: 'add-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/new-address/:professionalId/:whoGoes/:professionalSendCost/:referenceDocumentId/:appointmentId',
            loadComponent: () =>
              import('./new-address/new-address').then((m) => m.NewAddress),
          },
          {
            path: 'add-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/new-address/:whoGoes/:professionalSendCost/:referenceDocumentId/:appointmentId',
            loadComponent: () =>
              import('./new-address/new-address').then((m) => m.NewAddress),
          },
          {
            path: 'add-address/:facilityType/:facilityId/:serviceRequestId/:memberId/:facilityTypeId/new-address/:whoGoes/:professionalSendCost/:referenceDocumentId/:appointmentId',
            loadComponent: () =>
              import('./new-address/new-address').then((m) => m.NewAddress),
          },
          {
            path: 'doctor-vaccines-prescription/:appointmentId/:memberId',
            component: AddVaccines,
          },
          {
            path: 'edit-vaccines/:referralId',
            component: AddVaccines,
          },
          {
            path: 'add-medical-devices/:appointmentId/:memberId',
            component: AddMedicalDevices,
          },
          {
            path: 'edit-medical-devices/:referralId',
            component: AddMedicalDevices,
          },
          {
            path: 'add-herbals-and-nutraceuticals/:appointmentId/:memberId',
            component: AddHerbalsAndNutraceuticals,
          },
          {
            path: 'edit-herbals-and-nutraceuticals/:referralId',
            component: AddHerbalsAndNutraceuticals,
          },
          {
            path: 'doctor-available-hospital',
            component: DoctorAvailableHospital,
          },
          {
            path: 'doctor-available-invitations',
            component: DoctorAvailableInvitation,
          },
          {
            path: 'view-invite',
            component: DoctorViewInvite,
          },
          {
            path: 'list-all-professional-appointment-requests',
            component: ListAllProfessionalAppointmentRequests,
          },
          {
            path: 'accept-professional-request/:appointmentId',
            component: AcceptProfessionalRequest,
          },
          {
            path: 'doctor-available-appointments',
            component: DoctorAvailableAppointments,
          },
          {
            path: 'appointment-video-call-doctor/:appointmentId',
            component: AppointmentVideoCallDoctor,
          },
          {
            path: 'doctor-profile',
            component: DoctorProfilePage,
          },
          {
            path: 'doctor-details',
            component: DoctorProfile,
          },
          {
            path: 'add-doctor-bank',
            component: AddDoctorBank,
          },
          {
            path: 'add-doctor-bank/:edit/:bankAccountId',
            component: AddDoctorBank,
          },
          {
            path: 'wallet-history',
            component: DoctorWalletHistory,
          },
          {
            path: 'wallet-withdrawal',
            component: DoctorWalletWithdrawal,
          },
          {
            path: ':withdrawalId/wallet-withdraw-otp',
            component: DoctorValidateOtp,
          },
          {
            path: 'wallet-transaction-type/:flowId/:flowType',
            component: DoctorCreditOrDebitDetails,
          },
          {
            path: 'edit-doctor/:edit',
            component: AddDoctor,
          },
          {
            path: 'edit-doctor-license/:step',
            component: AddDoctorLicense,
          },
          {
            path: 'upload-license',
            component: UploadDoctorsLicense,
          },
          {
            path: 'doctor-profile/upload-profile-picture',
            component: UploadProfilePicture,
          },
          {
            path: 'view-appointment/:appointmentId/:memberId',
            component: ViewAppointment,
          },
          {
            path: 'view-appointment/:appointmentId/:memberId',
            component: ViewAppointment,
          },
          {
            path: 'view-appointment/:appointmentId',
            component: ViewAppointment,
          },
          {
            path: 'select-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/select-address/:professionalId/:whoGoes/:professionalSendCost/:appointmentId',
            loadComponent: () =>
              import('./select-address/select-address').then(
                (m) => m.SelectAddress
              ),
          },
          {
            path: 'select-address/:facilityType:serviceRequestId/:memberId/:facilityTypeId/select-address/:whoGoes/:professionalSendCost/:appointmentId',
            loadComponent: () =>
              import('./select-address/select-address').then(
                (m) => m.SelectAddress
              ),
          },
        ],
      },
    ],
  },
];
