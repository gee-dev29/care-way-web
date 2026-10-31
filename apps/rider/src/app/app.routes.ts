import { Route } from '@angular/router';
import { RiderSignup } from './rider-signup/rider-signup';
import { RiderLogin } from './rider-login/rider-login';
import { VerifyOtp } from './verify-otp/verify-otp';
import { SetPassword } from './set-password/set-password';
import { ForgotPassword } from './forgot-password/forgot-password';
import { AddRiderDrivingLicense } from './add-rider-driving-license/add-rider-driving-license';
import { UploadDriverLicense } from './upload-driver-license/upload-driver-license';
import { RiderSummary } from './rider-summary/rider-summary';
import { AddBankRider } from './add-bank-rider/add-bank-rider';
import { DashboardRider } from './dashboard-rider/dashboard-rider';
import { AllOrderRider } from './all-order-rider/all-order-rider';
import { OrderDetailsRider } from './order-details-rider/order-details-rider';
import { OrderCapture } from './order-capture/order-capture';
import { AuthGuard } from '@healbridge/shared';
import { DeliveryPin } from './delivery-pin/delivery-pin';
import { MoreRider } from './more-rider/more-rider';
import { UploadProfilePicture } from './upload-profile-picture/upload-profile-picture';
import { RiderHome } from './rider-home/rider-home';
import { AllTransaction } from './all-transaction/all-transaction';
import { PersonalInformation } from './personal-information/personal-information';
import { RiderWalletHistory } from './rider-wallet-history/rider-wallet-history';
import { RiderWalletWithdrawal } from './rider-wallet-withdrawal/rider-wallet-withdrawal';
import { RiderValidateOtp } from './rider-validate-otp/rider-validate-otp';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: RiderLogin,
  },
  {
    path: 'signup',
    component: RiderSignup,
  },
  {
    path: 'verify-otp/:email/:module',
    component: VerifyOtp,
  },
  {
    path: 'set-password',
    component: SetPassword,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },

  {
    path: 'dashboard',
    component: DashboardRider,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: RiderHome,
      },
      {
        path: 'add-rider-license/:riderId',
        component: AddRiderDrivingLicense,
      },
      {
        path: 'add-rider-license/:riderId/:edit',
        component: AddRiderDrivingLicense,
      },
      {
        path: 'upload-rider-license/:riderId',
        component: UploadDriverLicense,
      },
      {
        path: 'upload-rider-license/:riderId/:edit',
        component: UploadDriverLicense,
      },
      {
        path: 'personal-information/:riderId',
        component: PersonalInformation,
      },
      {
        path: 'summary/:riderId',
        component: RiderSummary,
      },
      {
        path: 'profile/:riderId',
        component: RiderSummary,
      },
      {
        path: 'add-bank-rider/:riderId',
        component: AddBankRider,
      },
      {
        path: 'add-bank-rider/:riderId/:edit/:bankAccountId',
        component: AddBankRider,
      },
      {
        path: 'all-orders',
        component: AllOrderRider,
      },
      {
        path: 'order-details/:serviceRequestId',
        component: OrderDetailsRider,
      },
      {
        path: 'capture-order/:serviceRequestOrderId',
        component: OrderCapture,
      },
      {
        path: 'delivery-pin/:serviceRequestOrderId',
        component: DeliveryPin,
      },
      {
        path: 'more',
        component: MoreRider,
      },
      {
        path: 'upload-profile-picture/:riderId',
        component: UploadProfilePicture,
      },
      {
        path: 'all-transactions',
        component: AllTransaction,
      },
      {
        path: 'wallet-history',
        component: RiderWalletHistory,
      },
      {
        path: 'wallet-withdraw',
        component: RiderWalletWithdrawal,
      },
      {
        path: ':withdrawalId/wallet-withdraw-otp',
        component: RiderValidateOtp,
      },
      {
        path: 'wallet-transaction-type/:flowId/:flowType',
        loadComponent: () =>
          import('./credit-or-debit-details/credit-or-debit-details').then(
            (m) => m.CreditOrDebitDetails
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
