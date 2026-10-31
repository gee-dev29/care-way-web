import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import {
  AuthService,
  ProfileInfoService,
  ToastService,
} from '@care-way/shared';
import { MoreMenuPage } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';
@Component({
  selector: 'agency-dashboard-more',
  imports: [MoreMenuPage, IonContent],
  templateUrl: './dashboard-more.html',
  styleUrl: './dashboard-more.css',
})
export class DashboardMore {
  private router = inject(Router);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public toast = inject(ToastService);
  public profileInfoService: any = inject(ProfileInfoService);
  back() {
    this.router.navigateByUrl('/dashboard/home');
  }
  moreMenu: any = [
    {
      name: 'Profile',
      link: '/dashboard/profile',
      icon: '/logo/profile-icon.svg',
    },
    {
      name: 'Log out',
      icon: '/logo/logout.svg',
    },
  ];
}
