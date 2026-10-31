import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { ApiService, ProfessionalType } from '@care-way/api';
import { AuthService, ToastService } from '@care-way/shared';
import { PushService } from '@care-way/ui';
import {
  IonAvatar,
  IonBadge,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
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
  calendarOutline,
  notificationsOutline,
  powerOutline,
} from 'ionicons/icons';
import { map, Subject, takeUntil } from 'rxjs';
import { addNotification, notifications$ } from '../notification/notification';

@Component({
  selector: 'medical-facility-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    IonSkeletonText,
    IonContent,
    IonIcon,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonLabel,
    IonTabButton,
    IonTabBar,
    IonTabs,
    RouterLink,
    IonImg,
    IonAvatar,
    IonBadge,
    RouterLinkActive,
  ],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit, OnDestroy {
  loading = true;

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private push = inject(PushService);
  private destroy$ = new Subject<void>();
  profileInfoService: any = {};

  doctorName = '';
  unreadNotificationCount = 0;
  professionalId: any;
  isMobile = window.innerWidth < 768;
  currentRoute = '';
  constructor() {
    addIcons({ notificationsOutline, powerOutline, calendarOutline });
    notifications$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.unreadNotificationCount = items.filter((item) => !item.read).length;
    });
    this.push.initialize(this.api, 'Doctor', (notification) => {
      addNotification({
        id: (notification as any).id,
        title: notification.title,
        body: notification.body,
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
    this.auth.userDetail(this.api, (auth) => {
      this.professionalId = auth?.userTypeId;

      this.api
        .getUser({ userId: this.professionalId })
        .subscribe((res: any) => {
          this.doctorName = res?.lastName ?? '';
        });
      this.profileInfoService.name = ProfessionalType.Doctor;
    });
    this.loadProfile();
  }
  loadProfile() {
    this.auth.userDetail(this.api, (auth) => {
      this.profileInfoService.name = auth?.name as string;

      const userId = auth?.userTypeId as any;
      this.getProfilePicture(userId).subscribe((url: any) => {
        this.profileInfoService.picture = url;
        this.loading = false;
      });
    });
  }
  getProfilePicture(referencedDocumentId: string) {
    return this.api.getUploads({ referencedDocumentId }).pipe(
      map((response: any[]) => {
        return response?.length ? response[response.length - 1].url : null;
      })
    );
  }
  goToProfile() {
    this.router.navigate([
      '/doctor-dashboard',
      this.professionalId,
      'doctor-profile',
    ]);
  }
  route(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/doctor-dashboard', this.professionalId, 'notifications']);
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
  navigate(path: string) {
    this.router.navigateByUrl(path);
  }
  isActive(path: string): boolean {
    if (path === '/dashboard/home') {
      return this.currentRoute === path;
    }
    return this.currentRoute.startsWith(path);
  }
}
