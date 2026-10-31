import { Routes } from '@angular/router';
import { AuthGuard } from '@care-way/shared';
import {
  AvailableSymptoms,
  ConsultationLiveVideo,
  GlucoseType,
  PaymentSummary,
  PreviewVideo,
  ScanPrescription,
} from '@care-way/ui';
import { DashboardCostFlow } from './dashboard-cost-flow/dashboard-cost-flow';
import { AddBpVitals } from './dashboard-vitals/add-bp-vitals/add-bp-vitals';
import { VitalsAddHeight } from './dashboard-vitals/vitals-add-height/vitals-add-height';
import { VitalsAddTemperature } from './dashboard-vitals/vitals-add-temperature/vitals-add-temperature';
import { VitalsAddWeight } from './dashboard-vitals/vitals-add-weight/vitals-add-weight';
import { VitalsHeightRecords } from './dashboard-vitals/vitals-height-records/vitals-height-records';
import { VitalsTemperatureRecords } from './dashboard-vitals/vitals-temperature-records/vitals-temperature-records';
import { VitalsWeightRecords } from './dashboard-vitals/vitals-weight-records/vitals-weight-records';
import { Dashboard } from './dashboard/dashboard';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Home } from './home/home';
import { Login } from './login/login';
import { PrescriptionUpload } from './prescription-upload/prescription-upload';
import { ScheduleAppointmentComponent } from './schedule-appointment/schedule-appointment';
import { SetPassword } from './set-password/set-password';
import { Signup } from './signup/signup';
import { Slide1 } from './slide1/slide1';
import { VerifyOtp } from './verify-otp/verify-otp';
import { AddOxygenSaturation } from './add-oxygen-saturation/add-oxygen-saturation';
import { RecordsOxygenSaturation } from './records-oxygen-saturation/records-oxygen-saturation';
import { AddRandomGlucose } from './dashboard-vitals/add-random-glucose/add-random-glucose';
import { AddPostprandialVitals } from './dashboard-vitals/add-postprandial-vitals/add-postprandial-vitals';
import { VitalAddFasting } from './dashboard-vitals/vital-add-fasting/vital-add-fasting';
import { VitalsGlucoseRecord } from './dashboard-vitals/vitals-glucose-record/vitals-glucose-record';
import { CreateOgtt } from './create-ogtt/create-ogtt';
import { Symptoms } from './dashboard-vitals/vitals-symptoms/symptoms/symptoms';
import { AddSymptoms } from './dashboard-vitals/vitals-symptoms/add-symptoms/add-symptoms';
import { SymptomsUpload } from './dashboard-vitals/vitals-symptoms/symptoms-upload/symptoms-upload';
import { UploadedSymptoms } from './dashboard-vitals/vitals-symptoms/uploaded-symptoms/uploaded-symptoms';
import { SymptomsDetails } from './dashboard-vitals/vitals-symptoms/symptoms-details/symptoms-details';
import { ScheduleApppointmentSymptoms } from './dashboard-vitals/vitals-symptoms/schedule-apppointment-symptoms/schedule-apppointment-symptoms';
import { SymptomsSummary } from './dashboard-vitals/vitals-symptoms/symptoms-summary/symptoms-summary';
import { VitalsBloodPressureRecords } from './dashboard-vitals/vitals-blood-pressure-records/vitals-blood-pressure-records';
import { PostPrandialVitals } from './dashboard-vitals/post-prandial-vitals/post-prandial-vitals';
import { ScheduleAppointmentPaymentSummary } from './schedule-appointment-payment-summary/schedule-appointment-payment-summary';
import { Ogtt } from './ogtt/ogtt';
import { ViewAppointmentCustomer } from './view-appointment-customer/view-appointment-customer';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'slide1',
    component: Slide1,
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
    path: 'verify-otp/:email/:module',
    component: VerifyOtp,
  },
  {
    path: 'add-address',
    loadComponent: () =>
      import('./dashboard-add-address/dashboard-add-address').then(
        (m) => m.DashboardAddAddress
      ),
  },
  {
    path: 'consultation-live-video',
    component: ConsultationLiveVideo,
  },
  {
    path: 'preview-video',
    component: PreviewVideo,
  },
  {
    path: 'help-home-page',
    loadComponent: () =>
      import('./help-home-page/help-home-page').then((m) => m.HelpHomePage),
  },
  {
    path: 'help-page/:helpId/:orderId',
    loadComponent: () =>
      import('./help-page/help-page').then((m) => m.HelpPage),
  },
  {
    path: 'help-page-detail/:orderId/:helpId',
    loadComponent: () =>
      import('./help-page-detail/help-page-detail').then(
        (m) => m.HelpPageDetail
      ),
  },

  {
    path: 'add-address/:serviceRequestId/:memberId/new-address/:whoGoes/:professionalSendCost/:referenceDocumentId/:appointmentId',
    loadComponent: () =>
      import('./new-address-customer/new-address-customer').then(
        (m) => m.NewAddressCustomer
      ),
  },
  {
    path: 'add-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/new-address/:whoGoes/:professionalSendCost/:referenceDocumentId/:appointmentId',
    loadComponent: () =>
      import('./new-address-customer/new-address-customer').then(
        (m) => m.NewAddressCustomer
      ),
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./dashboard-home/dashboard-home').then(
            (m) => m.DashboardHome
          ),
      },
      {
        path: 'help-page-detail/:orderId/:helpId/:user',
        loadComponent: () =>
          import('./help-page-detail/help-page-detail').then(
            (m) => m.HelpPageDetail
          ),
      },
      {
        path: 'create-reminder/:orderId/:orderItemId',
        loadComponent: () =>
          import('./create-reminder/create-reminder').then(
            (m) => m.CreateReminder
          ),
      },
      {
        path: 'list-all-cards',
        loadComponent: () =>
          import('./list-all-cards/list-all-cards').then((m) => m.ListAllCards),
      },
      {
        path: 'list-all-cards/:orderType/:orderId/:email/:firstName/:lastName/:removeSome/:route',
        loadComponent: () =>
          import('./list-all-cards/list-all-cards').then((m) => m.ListAllCards),
      },
      {
        path: 'list-all-cards/:orderType/:orderId/:appointmentId/:email/:firstName/:lastName/:removeSome/:route',
        loadComponent: () =>
          import('./list-all-cards/list-all-cards').then((m) => m.ListAllCards),
      },
      {
        path: 'schedule-appointment',
        component: ScheduleAppointmentComponent,
      },
      {
        path: 'schedule-appointment/:symptomId',
        component: ScheduleAppointmentComponent,
      },
      {
        path: 'upload/:flow/:serviceRequestId',
        component: DashboardCostFlow,
      },
      {
        path: 'view-appointment/:appointmentId',
        component: ViewAppointmentCustomer,
      },
      {
        path: 'follow-up-request',
        loadComponent: () =>
          import('./follow-up-request/follow-up-request').then(
            (m) => m.FollowUpRequest
          ),
      },
      {
        path: 'create-reminder',
        loadComponent: () =>
          import('./create-reminder/create-reminder').then(
            (m) => m.CreateReminder
          ),
      },
      {
        path: 'prescription',
        loadComponent: () =>
          import('./dashboard-prescription/dashboard-prescription').then(
            (m) => m.DashboardPrescription
          ),
      },
      {
        path: 'create-drug-adverse/:orderId/:orderItemId',
        loadComponent: () =>
          import('./create-drug-adverse/create-drug-adverse').then(
            (m) => m.CreateDrugAdverse
          ),
      },
      {
        path: 'share-order-payment-link/:orderId',
        loadComponent: () =>
          import('./share-order-link/share-order-link').then(
            (m) => m.ShareOrderLink
          ),
      },
      {
        path: 'share-order-payment-link/:orderId',
        loadComponent: () =>
          import('./share-order-link/share-order-link').then(
            (m) => m.ShareOrderLink
          ),
      },
      {
        path: 'share-order-payment-link/:appointmentId/:orderId',
        loadComponent: () =>
          import('./share-order-link/share-order-link').then(
            (m) => m.ShareOrderLink
          ),
      },
      {
        path: 'prescription/prescription-details/:appointmentId',
        loadComponent: () =>
          import('./prescription-details/prescription-details').then(
            (m) => m.PrescriptionDetails
          ),
      },
      {
        path: ':serviceRequestId/:facilityType/:medical-type/:memberId/pricing',
        loadComponent: () =>
          import(
            './dashboard-description-pricing/dashboard-description-pricing'
          ).then((m) => m.DashboardDescriptionPricing),
      },
      {
        path: ':serviceRequestId/:facilityType/:medical-type/:memberId/prescription/:limit',
        loadComponent: () =>
          import(
            './dashboard-prescription-limit/dashboard-prescription-limit'
          ).then((m) => m.DashboardPrescriptionLimit),
      },
      {
        path: ':serviceRequestId/:facilityType/:medical-type/:facilityTypeId/:memberId/prescription/:limit',
        loadComponent: () =>
          import(
            './dashboard-prescription-limit/dashboard-prescription-limit'
          ).then((m) => m.DashboardPrescriptionLimit),
      },
      // {
      //   path: ':serviceRequestId/:facilityType/:medical-type/:memberId/:facilityTypeId/:orderId/prescription/:limit/limit-summary',
      //   loadComponent: () =>
      //     import(
      //       './dashboard-prescription-limit-summary/dashboard-prescription-limit-summary'
      //     ).then((m) => m.DashboardPrescriptionLimitSummary),
      // },
      {
        path: 'address/:flow/:serviceRequestId/:orderId',
        loadComponent: () =>
          import(
            './dashboard-prescription-address/dashboard-prescription-address'
          ).then((m) => m.DashboardPrescriptionAddress),
      },
      {
        path: 'address/:flow/:serviceRequestId',
        loadComponent: () =>
          import(
            './dashboard-prescription-address/dashboard-prescription-address'
          ).then((m) => m.DashboardPrescriptionAddress),
      },

      {
        path: 'add-address/:flow/:serviceRequestId',
        loadComponent: () =>
          import(
            './dashboard-prescription-add-address/dashboard-prescription-add-address'
          ).then((m) => m.DashboardPrescriptionAddAddress),
      },
      {
        path: 'add-address/:flow/:serviceRequestId/:orderId',
        loadComponent: () =>
          import(
            './dashboard-prescription-add-address/dashboard-prescription-add-address'
          ).then((m) => m.DashboardPrescriptionAddAddress),
      },
      {
        path: 'uploaded-and-address/:flow/:serviceRequestId',
        loadComponent: () =>
          import(
            './uploaded-prescription-and-address/uploaded-prescription-and-address'
          ).then((m) => m.UploadedPrescriptionAndAddress),
      },
      {
        path: 'uploaded-and-attachment/:flow',
        loadComponent: () =>
          import(
            './uploaded-prescription-and-attachment/uploaded-prescription-and-attachment'
          ).then((m) => m.UploadedPrescriptionAndAttachment),
      },
      {
        path: 'requests',
        loadComponent: () =>
          import(
            './dashboard-prescription-medical-requests/dashboard-prescription-medical-requests'
          ).then((m) => m.DashboardPrescriptionMedicalRequests),
      },
      {
        path: 'medical-service-details/:requestId',
        loadComponent: () =>
          import(
            './medical-service-details/medical-service-details'
          ).then((m) => m.MedicalServiceDetails),
      },
      {
        path: 'help-requests',
        loadComponent: () =>
          import('./all-help-requests/all-help-requests').then(
            (m) => m.AllHelpRequests
          ),
      },
      {
        path: 'prescription/:limit',
        loadComponent: () =>
          import(
            './dashboard-prescription-limit/dashboard-prescription-limit'
          ).then((m) => m.DashboardPrescriptionLimit),
      },
      {
        path: 'upload-result/:appointmentId',
        loadComponent: () =>
          import('./upload-result/upload-result').then((m) => m.UploadResult),
      },
      {
        path: 'uploaded-prescription/:flow/:serviceRequestId',
        loadComponent: () =>
          import('./uploaded-prescription/uploaded-prescription').then(
            (m) => m.UploadedPrescription
          ),
      },

      {
        path: 'vitals',
        loadComponent: () =>
          import('./dashboard-vitals/vitals-home-page/vitals-home-page').then(
            (m) => m.VitalsHomePage
          ),
      },
      {
        path: 'payment-summary/:appointmentId',
        component: ScheduleAppointmentPaymentSummary,
      },
      {
        path: 'scan-prescription',
        component: ScanPrescription,
      },
      {
        path: 'upload-prescription',
        component: PrescriptionUpload,
      },
      {
        path: 'vitals/upload-symptoms/:bodyId/:module',
        component: SymptomsUpload,
      },
      {
        path: 'vitals/uploaded-sypmtoms/:bodyId/:module',
        component: UploadedSymptoms,
      },
      {
        path: 'vitals/symptoms-details/:bodyId/:module',
        component: SymptomsDetails,
      },
      {
        path: 'vitals/schedule-appointments/:module',
        component: ScheduleApppointmentSymptoms,
      },
      {
        path: 'vitals/symptoms-summary/:appointmentId/:module',
        component: SymptomsSummary,
      },
      {
        path: 'vitals/blood-pressure-record/:module',
        component: VitalsBloodPressureRecords,
      },
      {
        path: 'vitals/add-bp/:module',
        component: AddBpVitals,
      },
      {
        path: 'vitals/temperature-record/:module',
        component: VitalsTemperatureRecords,
      },
      {
        path: 'vitals/add-temperature/:module',
        component: VitalsAddTemperature,
      },
      {
        path: 'vitals/glucose-type/:module',
        component: GlucoseType,
      },
      {
        path: 'vitals/random/:module',
        component: AddRandomGlucose,
      },
      {
        path: 'vitals/ogtt/:module',
        component: Ogtt,
      },
      {
        path: 'vitals/add-ogtt/:module',
        component: CreateOgtt,
      },
      {
        path: 'vitals/fasting/:module',
        component: VitalAddFasting,
      },
      {
        path: 'vitals/glucose-record/:vitalType/:module',
        component: VitalsGlucoseRecord,
      },
      {
        path: 'vitals/post-prandial/:module',
        component: PostPrandialVitals,
      },
      {
        path: 'vitals/add-post-prandial/:module',
        component: AddPostprandialVitals,
      },

      {
        path: 'vitals/weight-record/:module',
        component: VitalsWeightRecords,
      },
      {
        path: 'vitals/add-weight/:module',
        component: VitalsAddWeight,
      },

      {
        path: 'vitals/height-record/:module',
        component: VitalsHeightRecords,
      },
      {
        path: 'vitals/add-height/:module',
        component: VitalsAddHeight,
      },
      {
        path: 'vitals/oxygen-saturation-record/:module',
        component: RecordsOxygenSaturation,
      },
      {
        path: 'vitals/add-oxygen-saturation/:module',
        component: AddOxygenSaturation,
      },
      {
        path: 'vitals/scan-symptoms/:module',
        component: ScanPrescription,
      },
      {
        path: 'vitals/symptoms/:module',
        component: Symptoms,
      },
      {
        path: 'vitals/add-symptoms/:module',
        component: AddSymptoms,
      },
      {
        path: 'vitals/available-symptoms/:module',
        component: AvailableSymptoms,
      },
      {
        path: 'more',
        loadComponent: () =>
          import('./dashboard-more/dashboard-more').then(
            (m) => m.DashboardMore
          ),
      },

      {
        path: 'hmo-products',
        data: { mode: 'browse' },
        loadComponent: () =>
          import('./hmo/hmo-product-list/hmo-product-list').then(
            (m) => m.HmoProductList
          ),
      },
      {
        path: 'hmo-purchase-history',
        data: { mode: 'active' },
        loadComponent: () =>
          import('./hmo/hmo-product-list/hmo-product-list').then(
            (m) => m.HmoProductList
          ),
      },
      {
        path: 'hmo-product-details/:hmoId/:hmoProductId',
        loadComponent: () =>
          import('./hmo/hmo-product-details/hmo-product-details').then(
            (m) => m.HmoProductDetails
          ),
      },
      {
        path: 'hmo-select-members',
        loadComponent: () =>
          import('./hmo/hmo-select-members/hmo-select-members').then(
            (m) => m.HmoSelectMembers
          ),
      },
      {
        path: 'hmo-preferred-hospital',
        loadComponent: () =>
          import('./hmo/hmo-preferred-hospital/hmo-preferred-hospital').then(
            (m) => m.HmoPreferredHospital
          ),
      },
      {
        path: 'hmo-payment-summary',
        data: { mode: 'checkout' },
        loadComponent: () =>
          import('./hmo/hmo-summary/hmo-summary').then((m) => m.HmoSummary),
      },
      {
        path: 'hmo-plan/:orderId',
        data: { mode: 'active' },
        loadComponent: () =>
          import('./hmo/hmo-summary/hmo-summary').then((m) => m.HmoSummary),
      },
      {
        path: 'connection-requests',
        loadComponent: () =>
          import(
            './dashboard-connection-requests/dashboard-connection-requests'
          ).then((m) => m.DashboardConnectionRequests),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then((m) => m.Profile),
      },
      {
        path: 'profile-information',
        loadComponent: () =>
          import('./profile-information/profile-information').then(
            (m) => m.ProfileInformation
          ),
      },
      {
        path: 'profile-information/:vitals/:module',
        loadComponent: () =>
          import('./profile-information/profile-information').then(
            (m) => m.ProfileInformation
          ),
      },
      {
        path: 'profile-summary',
        loadComponent: () =>
          import('./profile-summary/profile-summary').then(
            (m) => m.ProfileSummary
          ),
      },
      {
        path: 'notification-settings',
        loadComponent: () =>
          import('./notification-settings/notification-settings').then(
            (m) => m.NotificationSettings
          ),
      },
      {
        path: 'referral',
        loadComponent: () =>
          import('./referral/referral').then((m) => m.Referral),
      },
      {
        path: 'referral-history',
        loadComponent: () =>
          import('./referral-history/referral-history').then(
            (m) => m.ReferralHistory
          ),
      },

      {
        path: 'add-member',
        loadComponent: () =>
          import('./add-a-member/add-a-member').then((m) => m.AddAMember),
      },
      {
        path: 'add-member/:memberId',
        loadComponent: () =>
          import('./add-a-member/add-a-member').then((m) => m.AddAMember),
      },
      {
        path: 'all-members',
        loadComponent: () =>
          import('./dashboard-all-members/dashboard-all-members').then(
            (m) => m.DashboardAllMembers
          ),
      },
      {
        path: 'member-details/:memberId',
        loadComponent: () =>
          import('./view-member/view-member').then((m) => m.ViewMember),
      },
      {
        path: 'upload-profile-picture',
        loadComponent: () =>
          import('./upload-member-picture/upload-member-picture').then(
            (m) => m.UploadMemberPicture
          ),
      },
      {
        path: 'upload-member-picture/:memberId',
        loadComponent: () =>
          import('./upload-member-picture/upload-member-picture').then(
            (m) => m.UploadMemberPicture
          ),
      },
      {
        path: 'order-details/:orderId/delivered',
        loadComponent: () =>
          import('./order-details/order-details').then((m) => m.OrderDetails),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./dashboard-all-orders/dashboard-all-orders').then(
            (m) => m.DashboardAllOrders
          ),
      },
      {
        path: 'order-details/:orderId',
        loadComponent: () =>
          import('./order-details/order-details').then((m) => m.OrderDetails),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./appointments/appointments').then((m) => m.Appointments),
      },
      {
        path: 'appointment-video-call/:appointmentId',
        loadComponent: () =>
          import('./appointment-video-call/appointment-video-call').then(
            (m) => m.AppointmentVideoCall
          ),
      },
      {
        path: 'appointment-details/:appointmentId',
        loadComponent: () =>
          import('./appointment-details/appointment-details').then(
            (m) => m.AppointmentDetails
          ),
      },
      {
        path: 'appointments/:appointmentStatus',
        loadComponent: () =>
          import('./appointments/appointments').then((m) => m.Appointments),
      },
      {
        path: 'add-appointment-type',
        loadComponent: () =>
          import('./add-appointment-type/add-appointment-type').then(
            (m) => m.AddAppointmentType
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./notification/notification').then((m) => m.Notification),
      },
      {
        path: 'select-address/:serviceRequestId/:memberId/select-address/:whoGoes/:professionalSendCost/:appointmentId',
        loadComponent: () =>
          import('./select-address-customer/select-address-customer').then(
            (m) => m.SelectAddressCustomer
          ),
      },
      {
        path: 'select-address/:facilityType/:serviceRequestId/:memberId/:facilityTypeId/select-address/:whoGoes/:professionalSendCost/:appointmentId',
        loadComponent: () =>
          import('./select-address-customer/select-address-customer').then(
            (m) => m.SelectAddressCustomer
          ),
      },

      {
        path: 'reminder-details',
        loadComponent: () =>
          import('./reminder-details/reminder-details').then(
            (m) => m.ReminderDetails
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },

  // {
  //   path: 'appointment-details/:appointmentId',
  //   loadComponent: () =>
  //     import('./appointment-details/appointment-details').then(
  //       (m) => m.AppointmentDetails
  //     ),
  // },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
