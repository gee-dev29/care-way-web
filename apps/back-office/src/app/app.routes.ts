import { Route } from '@angular/router';
import { VerifyOtp } from './verify-otp/verify-otp';
import { Signin } from './signin/signin';
import { Signup } from './signup/signup';
import { ListAllCustomers } from './list-all-customers/list-all-customers';
import { AuthGuard, PageLayout, setLayout } from '@healbridge/shared';
import { CustomerDetails } from './customer-details/customer-details';
import { ListAllMedicalFacilities } from './list-all-medical-facilities/list-all-medical-facilities';
import { ListAllPharmacies } from './list-all-pharmacies/list-all-pharmacies';
import { ListAllLaboratories } from './list-all-laboratories/list-all-laboratories';
import { ListAllBloodBanks } from './list-all-blood-banks/list-all-blood-banks';
import { ListAllRadiologyCentres } from './list-all-radiology-centres/list-all-radiology-centres';
import { HospitalSpecialization } from './hospital-specialization/hospital-specialization';
import { Appointments } from './appointments/appointments';
import { ListAllHospitals } from './list-all-hospitals/list-all-hospitals';
import { HospitalDetails } from './hospital-details/hospital-details';
import { ListAllPharmacyServiceRequests } from './list-all-pharmacy-service-requests/list-all-pharmacy-service-requests';
import { ListAllLaboratoryServiceRequests } from './list-all-laboratory-service-requests/list-all-laboratory-service-requests';
import { ListAllBloodBankServiceRequests } from './list-all-blood-bank-service-requests/list-all-blood-bank-service-requests';
import { ListAllRadiologyCentreServiceRequests } from './list-all-radiology-centre-service-requests/list-all-radiology-centre-service-requests';
import { ServiceRequestDetails } from './service-request-details/service-request-details';
import { CreateMedicalFacility } from './create-medical-facility/create-medical-facility';
import { MedicalFacilityDetails } from './medical-facility-details/medical-facility-details';
import { AppointmentDetails } from './appointment-details/appointment-details';
import { ListAllDoctors } from './list-all-doctors/list-all-doctors';
import { MedicalProfessionalPharmacists } from './medical-professional-pharmacists/medical-professional-pharmacists';
import { MedicalProfessionalLab } from './medical-professional-lab/medical-professional-lab';
import { MedicalProfessionalBloodBank } from './medical-professional-blood-bank/medical-professional-blood-bank';
import { MedicalProfessionalRadiology } from './medical-professional-radiology/medical-professional-radiology';
import { PharmacistDetails } from './pharmacist-details/pharmacist-details';
import { DoctorDetails } from './doctor-details/doctor-details';
import { LaboratoryProfessionalDetails } from './laboratory-professional-details/laboratory-professional-details';
import { BloodbankProfessionalDetails } from './bloodbank-professional-details/bloodbank-professional-details';
import { RadiologyProfessionalDetails } from './radiology-professional-details/radiology-professional-details';
import { GreenBookDrugs } from './green-book-drugs/green-book-drugs';
import { GreenBookVaccinesBiologics } from './green-book-vaccines-biologics/green-book-vaccines-biologics';
import { GreenBookMedicalDevices } from './green-book-medical-devices/green-book-medical-devices';
import { GreenBookHerbs } from './green-book-herbs/green-book-herbs';
import { OrderDetails } from './order-details/order-details';
import { ListAllOrders } from './list-all-orders/list-all-orders';
import { ListAllRiders } from './list-all-riders/list-all-riders';
import { RiderDetails } from './rider-details/rider-details';
import { ListAllStaffs } from './list-all-staffs/list-all-staffs';
import { StaffDetails } from './staff-details/staff-details';
import { ListAllBanks } from './list-all-banks/list-all-banks';
import { SetPassword } from './set-password/set-password';
import { ListAllAgents } from './list-all-agents/list-all-agents';
import { AgentDetails } from './agent-details/agent-details';
import { ListAllWithdrawals } from './list-all-withdrawals/list-all-withdrawals';
import { WithdrawalDetails } from './withdrawal-details/withdrawal-details';
import { PharmacyDetails } from './pharmacy-details/pharmacy-details';
import { LaboratoryDetails } from './laboratory-details/laboratory-details';
import { BloodBankDetails } from './blood-bank-details/blood-bank-details';
import { RadiologyDetails } from './radiology-details/radiology-details';
import { AppVersion } from './app-version/app-version';
import { ListAllAds } from './list-all-ads/list-all-ads';
import { AddAds } from './add-ads/add-ads';
import { AddsDetails } from './adds-details/adds-details';
import { StaffGuard } from '../services/staff.guard';
import { ListAllApprovals } from './list-all-approvals/list-all-approvals';
import { CreateApprovalRoute } from './create-approval-route/create-approval-route';
import { ApprovalRouteDetails } from './approval-route-details/approval-route-details';
import { AllPendingApprovals } from './all-pending-approvals/all-pending-approvals';
import { AllWaitingApprovals } from './all-waiting-approvals/all-waiting-approvals';
import { ListAllHmo } from './list-all-hmo/list-all-hmo';
import { HmoDetails } from './hmo-details/hmo-details';
import { CreateHmo } from './create-hmo/create-hmo';
import { CreateHmoHospital } from './create-hmo-hospital/create-hmo-hospital';
import { HmoProductDetails } from './hmo-product-details/hmo-product-details';
import { HmoPurchasedList } from './hmo-purchased-list/hmo-purchased-list';
import { HmoPurchasedDetails } from './hmo-purchased-details/hmo-purchased-details';
import { Hospitals } from './hospitals/hospitals';
import { MyPendingApprovals } from './my-pending-approvals/my-pending-approvals';
import { MyApprovalHistory } from './my-approval-history/my-approval-history';
import { MsaRatesWallet } from './msa-rates-wallet/msa-rates-wallet';
import { MsaRatesFuture } from './msa-rates-future/msa-rates-future';
import { MsaRatesTargetL } from './msa-rates-target-l/msa-rates-target-l';
import { MsaRatesTargetS } from './msa-rates-target-s/msa-rates-target-s';
import { MsaRatesTargetM } from './msa-rates-target-m/msa-rates-target-m';
import { MsaRatesInvestment } from './msa-rates-investment/msa-rates-investment';
import { MsaOrder } from './msa-order/msa-order';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: Signin,
    resolve: {
      layout: setLayout(PageLayout.Default),
    },
  },
  {
    path: 'signup',
    component: Signup,
    resolve: {
      layout: setLayout(PageLayout.Default),
    },
  },
  {
    path: 'verify-otp/:email',
    component: VerifyOtp,
    resolve: {
      layout: setLayout(PageLayout.Default),
    },
  },
  {
    path: 'list-all-customers',
    component: ListAllCustomers,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'customer-details/:customerId',
    component: CustomerDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-agents',
    component: ListAllAgents,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'agent-details/:agentId',
    component: AgentDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-withdrawals',
    component: ListAllWithdrawals,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'withdrawal-details/:withdrawalId',
    component: WithdrawalDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-hmo',
    component: ListAllHmo,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'hmo-details/:hmoId',
    component: HmoDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'hmo-product-details/hmo/:hmoId/product/:hmoProductId',
    component: HmoProductDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'all-hmo-purchased-list',
    component: HmoPurchasedList,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'hmo-purchased-details/:orderId',
    component: HmoPurchasedDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'create-hmo',
    component: CreateHmo,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'create-hmo-hospital/:hmoId',
    component: CreateHmoHospital,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'preferences/list-all-hospitals',
    component: Hospitals,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-ads',
    component: ListAllAds,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'add-ads',
    component: AddAds,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'adds-details/:advertId',
    component: AddsDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-medical-facilities',
    component: ListAllMedicalFacilities,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-approval-routes',
    component: ListAllApprovals,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'create-approval-route',
    component: CreateApprovalRoute,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'approval-route-details/:approvalRouteId',
    component: ApprovalRouteDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'my-pending-approvals',
    component: MyPendingApprovals,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'my-approval-history',
    component: MyApprovalHistory,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-pending-approvals',
    component: AllPendingApprovals,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-waiting-approvals',
    component: AllWaitingApprovals,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-hospitals',
    component: ListAllHospitals,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'hospital-details/:facilityId/:facilityTypeId/:facilityType',
    component: HospitalDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-pharmacies',
    component: ListAllPharmacies,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'pharmacy-details/:facilityId/:facilityTypeId/:facilityType',
    component: PharmacyDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-laboratories',
    component: ListAllLaboratories,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'laboratory-details/:facilityId/:facilityTypeId/:facilityType',
    component: LaboratoryDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-blood-banks',
    component: ListAllBloodBanks,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'blood-bank-details/:facilityId/:facilityTypeId/:facilityType',
    component: BloodBankDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-radiology-centres',
    component: ListAllRadiologyCentres,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'radiology-details/:facilityId/:facilityTypeId/:facilityType',
    component: RadiologyDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-pharmacy-service-requests',
    component: ListAllPharmacyServiceRequests,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-laboratory-service-requests',
    component: ListAllLaboratoryServiceRequests,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-blood-bank-service-requests',
    component: ListAllBloodBankServiceRequests,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-radiology-centre-service-requests',
    component: ListAllRadiologyCentreServiceRequests,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'service-request-details/serviceRequestId/:serviceRequestId/memberId/:memberId/referralType/:referralType',
    component: ServiceRequestDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'create-medical-facility',
    component: CreateMedicalFacility,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'medical-facility-details/:facilityId',
    component: MedicalFacilityDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'preferences/hospital-specializations',
    component: HospitalSpecialization,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'preferences/app-version',
    component: AppVersion,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'msa-rates/wallet',
    component: MsaRatesWallet,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'msa-rates/investment',
    component: MsaRatesInvestment,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'msa-rates/future',
    component: MsaRatesFuture,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'msa-rates/target-l',
    component: MsaRatesTargetL,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'msa-rates/target-s',
    component: MsaRatesTargetS,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'msa-rates/target-m',
    component: MsaRatesTargetM,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'msa-order',
    component: MsaOrder,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'green-book/drugs',
    component: GreenBookDrugs,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'green-book/vaccines-biologics',
    component: GreenBookVaccinesBiologics,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'green-book/medical-devices',
    component: GreenBookMedicalDevices,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'green-book/herbals-nutraceuticals',
    component: GreenBookHerbs,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-orders',
    component: ListAllOrders,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'order-details/:orderId',
    component: OrderDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'appointments',
    component: Appointments,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-riders',
    component: ListAllRiders,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'rider-details/:riderId',
    component: RiderDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-staffs',
    component: ListAllStaffs,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'preferences/list-all-banks',
    component: ListAllBanks,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'staff-details/:userId',
    component: StaffDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'appointment-details/:appointmentId',
    component: AppointmentDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-doctors',
    component: ListAllDoctors,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-pharmacists',
    component: MedicalProfessionalPharmacists,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-laboratory-professionals',
    component: MedicalProfessionalLab,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-blood-bank-professionals',
    component: MedicalProfessionalBloodBank,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'list-all-radiology-professionals',
    component: MedicalProfessionalRadiology,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'doctor-details/:professionalId',
    component: DoctorDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'pharmacist-details/:professionalId',
    component: PharmacistDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'laboratory-professional-details/:professionalId',
    component: LaboratoryProfessionalDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'bloodbank-professional-details/:professionalId',
    component: BloodbankProfessionalDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'radiology-professional-details/:professionalId',
    component: RadiologyProfessionalDetails,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: 'set-password',
    component: SetPassword,
    resolve: {
      layout: setLayout(PageLayout.Default),
    },
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/list-all-customers' },
];
