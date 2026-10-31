import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService, ProfessionalType } from '@care-way/api';
import {
  AuthService,
  NurseActiveFacility,
  ToastService,
} from '@care-way/shared';
import { PushService } from '@care-way/ui';
import {
  IonAvatar,
  IonBadge,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonModal,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, powerOutline } from 'ionicons/icons';
import { map, Subject, takeUntil } from 'rxjs';
import { addNotification, notifications$ } from '../notification/notification';

@Component({
  selector: 'medical-facility-nurse-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonLabel,
    IonTabButton,
    IonTabBar,
    IonTabs,
    RouterLink,
    IonRouterOutlet,
    IonImg,
    IonAvatar,
    IonBadge,
    RouterLinkActive,
    IonIcon,
    IonModal,
    IonText,
  ],
  templateUrl: './nurse-dashboard.html',
  styleUrl: './nurse-dashboard.css',
})
export class NurseDashboard implements OnInit, OnDestroy {
  loading = true;
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private nurseActiveFacility = inject(NurseActiveFacility);
  private push = inject(PushService);
  private destroy$ = new Subject<void>();
  unreadNotificationCount = 0;

  nurseName = '';
  professionalId: any;
  isMobile = window.innerWidth < 768;
  currentRoute = '';
  profileInfoService: any = {};

  facilities: any[] = [];
  activeFacilityTypeId: string | null = null;
  activeFacilityName = '';
  isFacilityModalOpen = false;

  constructor() {
    addIcons({ notificationsOutline, powerOutline });
    notifications$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.unreadNotificationCount = items.filter((item) => !item.read).length;
    });
    this.push.initialize(this.api, 'Nurse', (notification) => {
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
    this.auth.userDetail(this.api, (auth: any) => {
      this.professionalId = auth?.userTypeId;
      this.profileInfoService.name = auth?.name || 'Nurse';
      this.nurseName = auth?.name || 'Nurse';
      const userId = auth?.userTypeId as any;
      this.getProfilePicture(userId).subscribe((url: any) => {
        this.profileInfoService.picture = url;
        this.loading = false;
      });
      this.loadFacilities();
    });
  }

  ionViewWillEnter() {
    this.loadProfile();
  }

  loadProfile() {
    this.auth.userDetail(this.api, (auth: any) => {
      this.profileInfoService.name = auth?.name || 'Nurse';
      this.nurseName = auth?.name || 'Nurse';
      const userId = auth?.userTypeId as any;
      this.getProfilePicture(userId).subscribe((url: any) => {
        this.profileInfoService.picture = url;
        this.loading = false;
      });
      this.loadFacilities();
    });
  }

  loadFacilities() {
    this.api
      .getAllConnectionRequest({ referencedDocumentId: this.professionalId })
      .subscribe((res: any) => {
        const connections = Array.isArray(res) ? res : res?.data ?? [];
        const approved = connections.filter(
          (connection: any) => connection?.status === 'Approved'
        );

        const seenFacilityTypeIds = new Set<string>();
        this.facilities = approved.filter((connection: any) => {
          if (seenFacilityTypeIds.has(connection.facilityTypeId)) {
            return false;
          }
          seenFacilityTypeIds.add(connection.facilityTypeId);
          return true;
        });

        const storedFacilityTypeId = localStorage.getItem('nurseFacilityTypeId');
        const selected =
          this.facilities.find(
            (facility: any) => facility.facilityTypeId === storedFacilityTypeId
          ) ?? this.facilities[0];

        if (selected) {
          this.setActiveFacility(selected);
        }
      });
  }

  openFacilityModal(event: Event) {
    event.stopPropagation();
    if (this.facilities.length) {
      this.isFacilityModalOpen = true;
    }
  }

  setActiveFacility(facility: any) {
    this.activeFacilityTypeId = facility.facilityTypeId;
    this.activeFacilityName = facility.facilityTypeName;
    this.nurseActiveFacility.setActiveFacilityTypeId(facility.facilityTypeId);
    this.isFacilityModalOpen = false;

    this.api
      .getMedicalProfessional({
        professionalId: this.professionalId,
        professionalType: ProfessionalType.Nurse,
      })
      .subscribe((professional: any) => {
        if (professional?.facilityId) {
          this.nurseActiveFacility.setActiveFacilityId(professional.facilityId);
        }
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
    this.router.navigate(['/nurse-dashboard', this.professionalId, 'nurse-profile']);
  }

  route(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/nurse-dashboard', this.professionalId, 'notifications']);
  }

  logout() {
    this.auth.userDetail(this.api, (auth: any) => {
      const sessionId = auth?.sessionId as any;
      this.api.destroySession({ sessionId }).subscribe(() => {
        this.toast.show('Logged out successfully', 'success');
        this.nurseActiveFacility.clear();
        this.auth.logout();
      });
    });
  }

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }

  isActive(path: string): boolean {
    if (path === '/nurse-dashboard/' + this.professionalId) {
      return this.currentRoute === path;
    }
    return this.currentRoute.startsWith(path);
  }
}
