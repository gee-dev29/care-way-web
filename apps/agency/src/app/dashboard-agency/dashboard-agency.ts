import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  inject,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService, ProfileInfoService } from '@healbridge/shared';
import { ToastService } from '@healbridge/ui';
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonAvatar,
  IonBadge,
  IonHeader,
  IonToolbar,
  IonLabel,
  IonSkeletonText,
  IonTabs,
  IonRouterOutlet,
  IonImg,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  peopleOutline,
  powerOutline,
  walletOutline,
} from 'ionicons/icons';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'agency-dashboard-agency',
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
    IonImg,
  ],
  templateUrl: './dashboard-agency.html',
  styleUrl: './dashboard-agency.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardAgency implements OnDestroy {
  picture$: Observable<any>;
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  public profileInfoService: any = inject(ProfileInfoService);
  loaded = true;
  showHeader = true;
  showTab = true;
  isMobile = window.innerWidth < 768;
  currentRoute = '';
  private destroy$ = new Subject<void>();

  constructor() {
    addIcons({
      notificationsOutline,
      powerOutline,
      walletOutline,
      peopleOutline,
    });
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects.split('?')[0];
      }
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ionViewWillEnter() {
    this.isMobile = window.innerWidth < 768;
    this.loadProfile();
  }

  loadProfile() {
    this.auth.userDetail(this.api, (auth) => {
      this.profileInfoService.name = auth?.name as string;
      this.picture$ = this.api
        .getUploads({ referencedDocumentId: auth?.jti as any })
        .pipe(
          map((response: any) => {
            response.forEach((element: any, index: any) => {
              if (
                index == response.length - 1 &&
                element.name == 'Upload Picture'
              ) {
                this.profileInfoService.picture = element.url;
              } else {
                this.profileInfoService.picture = null;
              }
            });
            return this.profileInfoService.picture;
          })
        );
    });
  }

  navigate(path: string) {
    this.router.navigateByUrl(path);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
