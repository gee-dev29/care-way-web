import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService, ProfileInfoService } from '@healbridge/shared';
import { Biometric, MoreMenuPage, ToastService } from '@healbridge/ui';

@Component({
  selector: 'app-dashboard-more',
  imports: [MoreMenuPage],
  templateUrl: './dashboard-more.html',
  styleUrl: './dashboard-more.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardMore implements OnInit {
  private router = inject(Router);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  biometricService = inject(Biometric);
  showBiometric = false;
  canUseBiometric = false;
  moreMenu: any = [];
  public toast = inject(ToastService);
  public profileInfoService: any = inject(ProfileInfoService);
  back() {
    this.router.navigateByUrl('/dashboard/home');
  }

  async ngOnInit() {
    this.reload();
  }

  async reload() {
    this.canUseBiometric = await this.biometricService.isSupported();
    this.showBiometric = await this.biometricService.hasBiometricCredentials(
      'customer'
    );
    this.moreMenu = [
      {
        name: 'HMO Products',
        link: '/dashboard/hmo-products',
        icon: '/logo/hmo-icon.svg',
      },
      {
        name: 'Profile',
        link: '/dashboard/profile',
        icon: '/logo/profile-icon.svg',
      },
      {
        name: 'Members',
        link: '/dashboard/all-members',
        icon: '/logo/member-icon.svg',
      },
      {
        name: 'Reminder',
        link: '/dashboard/reminder-details',
        icon: '/icons/clock2.svg',
      },
      {
        name: 'Connection Requests',
        link: '/dashboard/connection-requests',
        icon: '/logo/connection-icon.svg',
      },
      {
        name: 'Help Requests',
        link: '/dashboard/help-requests',
        icon: '/logo/help-icon.svg',
      },
      {
        name: 'Debit Cards',
        link: 'dashboard/list-all-cards',
        icon: '/logo/help-icon.svg',
      },
      {
        name: 'Log out',
        icon: '/logo/logout.svg',
      },
    ];
    if (this.canUseBiometric) {
      this.moreMenu.splice(this.moreMenu.length - 1, 0, {
        name: this.showBiometric ? 'Disable Biometric' : 'Enable Biometric',
        icon: '/logo/biometric.svg',
      });
    }
  }
}
