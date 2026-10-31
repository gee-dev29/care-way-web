import { Routes } from '@angular/router';
import { AuthGuard } from '@healbridge/shared';
import { DashboardAgency } from './dashboard-agency/dashboard-agency';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Login } from './login/login';
import { SetPassword } from './set-password/set-password';
import { SignUp } from './sign-up/sign-up';

import { AddBankAgency } from './add-bank-agency/add-bank-agency';
import { AgencyWalletHistory } from './agency-wallet-history/agency-wallet-history';
import { AgencyWalletWithdrawal } from './agency-wallet-withdrawal/agency-wallet-withdrawal';
import { AllOrders } from './all-orders/all-orders';
import { AllUsers } from './all-users/all-users';
import { BankAccount } from './bank-account/bank-account';
import { MedFacilities } from './med-facilities/med-facilities';
import { MedFacilityDetails } from './med-facility-details/med-facility-details';
import { UploadProfilePicture } from './upload-profile-picture/upload-profile-picture';
import { VerifyOtp } from './verify-otp/verify-otp';
import { AgencyValidateOtp } from './agency-validate-otp/agency-validate-otp';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: SignUp,
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

  // Dashboard routes
  {
    path: 'dashboard',
    component: DashboardAgency,
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
        path: 'add-bank-agency/:agentId',
        component: AddBankAgency,
      },
      {
        path: 'add-bank-agency/:agentId/profile',
        component: AddBankAgency,
      },
      {
        path: 'add-bank-agency/:agentId/:edit/:bankAccountId',
        component: AddBankAgency,
      },
      {
        path: 'bank-account',
        component: BankAccount,
      },
      {
        path: 'med-facilities',
        component: MedFacilities,
      },
      {
        path: 'med-facilities/:facilityId',
        component: MedFacilityDetails,
      },
      {
        path: 'all-orders/:facilityId/:facilityTypeId',
        component: AllOrders,
      },
      {
        path: 'all-appointments/:facilityId/:facilityTypeId',
        loadComponent: () =>
          import('./all-appointments/all-appointments').then(
            (m) => m.AllAppointments
          ),
      },
      {
        path: 'wallet-history',
        component: AgencyWalletHistory,
      },
      {
        path: 'wallet-withdraw',
        component: AgencyWalletWithdrawal,
      },
      {
        path: ':withdrawalId/wallet-withdraw-otp',
        component: AgencyValidateOtp,
      },
      {
        path: 'wallet-transaction-type/:flowId/:flowType',
        loadComponent: () =>
          import('./credit-or-debit-details/credit-or-debit-details').then(
            (m) => m.CreditOrDebitDetails
          ),
      },
      {
        path: 'all-customers',
        component: AllUsers,
      },
      {
        path: 'all-customers/:userId',
        loadComponent: () =>
          import('./customer-details/customer-details').then(
            (m) => m.CustomerDetails
          ),
      },
      {
        path: 'upload-profile-picture/:agentId',
        component: UploadProfilePicture,
      },

      {
        path: 'referral',
        loadComponent: () =>
          import('./referral/referral').then((m) => m.Referral),
      },
      {
        path: 'notification-settings',
        loadComponent: () =>
          import('./notification-settings/notification-settings').then(
            (m) => m.NotificationSettings
          ),
      },
      {
        path: 'referral-history',
        loadComponent: () =>
          import('./referral-history/referral-history').then(
            (m) => m.ReferralHistory
          ),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then((m) => m.Profile),
      },
      {
        path: 'personal-info',
        loadComponent: () =>
          import('./personal-info/personal-info').then((m) => m.PersonalInfo),
      },
      {
        path: 'more',
        loadComponent: () =>
          import('./dashboard-more/dashboard-more').then(
            (m) => m.DashboardMore
          ),
      },
    ],
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
