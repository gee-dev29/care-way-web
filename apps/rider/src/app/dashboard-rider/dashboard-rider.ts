import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService, ProfileInfoService } from '@care-way/shared';
import { ToastService } from '@care-way/ui';
import {
  IonAvatar,
  IonBadge,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSkeletonText,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bagHandleOutline,
  notificationsOutline,
  powerOutline,
} from 'ionicons/icons';

@Component({
  selector: 'rider-dashboard-rider',
  imports: [
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonTabs,
    IonAvatar,
    IonBadge,
    IonHeader,
    IonToolbar,
    IonLabel,
    IonSkeletonText,
    CommonModule,
  ],
  templateUrl: './dashboard-rider.html',
  styleUrl: './dashboard-rider.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardRider implements OnInit {
  public profileInfoService: any = inject(ProfileInfoService);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  loaded = true;
  showHeader = true;
  currentRoute = '';
  showTab = true;
  isMobile = window.innerWidth < 768;
  riderId: string;

  constructor() {
    addIcons({
      notificationsOutline,
      'bag-handle-outline': bagHandleOutline,
      powerOutline,
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.getRiderId();
  }

  getRiderId() {
    this.riderId = this.auth.getUserId() as any;
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ionViewWillEnter() {
    this.loadProfile();
  }

  loadProfile() {
    this.auth.userDetail(this.api, (auth) => {
      this.profileInfoService.name = auth?.name as string;
      this.api
        .getMembers({
          referencedDocumentId: auth?.jti,
        })
        .subscribe((response: any) => {
          this.profileInfoService.picture = response.data[0].profilePicture;
        });
    });
  }

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }

  navigateTwo(path: string) {
    this.router.navigate(['/dashboard', path, this.riderId]);
  }

  isActive(path: string): boolean {
    if (path === '/dashboard/home') {
      return this.currentRoute === path;
    }
    return this.currentRoute.startsWith(path);
  }

  logout() {
    this.auth.userDetail(this.api, (auth) => {
      const sessionId = auth?.sessionId as any;
      this.api.destroySession({ sessionId: sessionId }).subscribe(() => {
        this.toast.show('Logged out successfully', 'success');
        this.auth.logout();
      });
    });
  }
}
