import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  inject,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService, FacilityType } from '@care-way/api';
import {
  ConfirmationModal,
  PlusIconComponent,
  PushService,
  ToastService,
} from '@care-way/ui';
import { v4 } from 'uuid';

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
  IonModal,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  bagHandleOutline,
  chevronDown,
  close,
  notificationsOutline,
  peopleOutline,
  powerOutline,
  pulseOutline,
} from 'ionicons/icons';
import {
  AuthService,
  FacilityTypeService,
  ProfileInfoService,
} from '@care-way/shared';
import { distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { addNotification, notifications$ } from '../notification/notification';

@Component({
  selector: 'medical-facility-dashboard.component',
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
    IonModal,
    IonText,
    ConfirmationModal,
    CommonModule,
    PlusIconComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent implements OnDestroy {
  private router = inject(Router);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private toastr = inject(ToastService);
  FacilityType = FacilityType;
  private activatedRoute = inject(ActivatedRoute);
  public profileInfoService: any = inject(ProfileInfoService);
  private facilityTypeService = inject(FacilityTypeService);
  loaded = false;
  loadedd = false;
  open = false;
  completeModal = false;
  currentChildRoute = '';
  showHeader = true;
  showTab = true;
  private push = inject(PushService);
  unreadNotificationCount = 0;
  categoryId: string;
  facilityType: any;
  isFacilityModalOpen = false;
  activeFacilityType: string;
  confirmSwitchModalOpen = false;
  onBoardFacility: string;
  registeredFacility: string;
  href: any;
  bgColor: string;
  private destroy$ = new Subject<void>();
  facilityId: any;
  getAuth: any;
  selectedFacilityType: string;
  selectedFacilityName: string;
  currentRoute = '';
  isMobile = window.innerWidth < 768;
  allFacilities: any[] = [];
  initialFacilityData: any[] = [];
  selectedFacility: any = null;
  expandedType = '';
  whichFacilityType: any;
  facilityTypeId: any;
  isFacilityModalOpen2 = false;
  selected: string;
  FacilityTypes = FacilityType;
  subFacilityModalOpen = false;
  accounts: any;
  switchAccounts = [
    {
      id: 1,
      text: 'Pharmacy',
      bgColor: '#EFE3EE',
      facilityType: 'Pharmacy',
      icons: '/icons/pharmIcon.svg',
    },
    {
      id: 2,
      text: 'Hospital / Clinic',
      bgColor: '#D4D6EA',
      facilityType: 'Hospital',
      icons: '/icons/hospital.svg',
    },
    {
      id: 3,
      text: 'Laboratory',
      bgColor: '#D0EAFF',
      facilityType: 'Laboratory',
      icons: '/icons/laboratory.svg',
    },
    {
      id: 4,
      text: 'Blood Bank',
      bgColor: '#F76F6F',
      facilityType: 'Blood Bank',
      icons: '/icons/bloodbank.svg',
    },
    {
      id: 5,
      text: 'Radiology / Imaging',
      bgColor: '#D2D2A0',
      facilityType: 'Radiology',
      icons: '/icons/radiology.svg',
    },
  ];
  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        switch (true) {
          case url.includes('preview-video'):
            this.showHeader = false;
            this.showTab = false;
            break;
          case url.includes('onboarding'):
            this.showTab = false;
            this.showHeader = true;
            break;
          default:
            this.showHeader = true;
            this.showTab = true;
            break;
        }
      }
    });
    addIcons({
      notificationsOutline,
      close,
      chevronDown,
      pulseOutline,
      peopleOutline,
      'bag-handle-outline': bagHandleOutline,
      powerOutline,
      addOutline,
    });
    notifications$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.unreadNotificationCount = items.filter((item) => !item.read).length;
    });
    this.push.initialize(this.api, 'Facility', (notification) => {
      addNotification({
        id: (notification as any).id,
        title: notification.title,
        body: notification.body,
      });
    });
  }

  ionViewWillEnter() {
    this.isMobile = window.innerWidth < 768;
    this.auth.userDetail(this.api, (auth) => {
      this.getAuth = auth;
      const allowedRoles = [
        'Pharmacist',
        'Nurse',
        'Pharmacy Staff',
        'Blood Bank Staff',
        'Laboratory Staff',
        'Radiology Staff',
        'Medical Facility',
        'Doctor',
      ];
      const userType = (this.getAuth?.userType ?? '').trim();
      if (allowedRoles.includes(userType)) {
        this.facilityId = auth?.userTypeId;
        this.loadInitialData();
      } else {
        this.toastr.show("You can't use this credential on this app", 'error');
        localStorage.removeItem('facilityType');
        this.auth.logout();
      }
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

  loadInitialData() {
    if (!this.facilityTypeService.getFacilityType()) {
      this.api
        .getFacilityTypesOfFacility({ facilityId: this.facilityId } as any)
        .pipe(
          takeUntil(this.destroy$),
          filter((user) => !!user)
        )
        .subscribe((res: any) => {
          this.facilityTypeId =
            res?.[0]?.pharmacyId ??
            res?.[0]?.hospitalId ??
            res?.[0]?.radiologyId ??
            res?.[0]?.laboratoryId ??
            res?.[0]?.bloodBankId;
          if (this.facilityTypeId) {
            localStorage.setItem(
              'facilityTypeId',
              JSON.stringify(this.facilityTypeId)
            );
          }
          const type = res?.[0]?.facilityType ?? null;
          this.facilityTypeService.setFacilityType(type);
          this.loadProfile(type);
        });
    } else {
      this.facilityTypeService.facilityType$
        .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe((type) => {
          this.facilityType = type;
          this.facilityTypeId = JSON.parse(
            localStorage.getItem('facilityTypeId') as any
          );
          this.loadProfile(type);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleExpand(facilityType: string) {
    this.selectedFacilityType = facilityType;
    this.api
      .getFacilityTypesOfFacility({ facilityId: this.facilityId } as any)
      .subscribe((res: any) => {
        this.registeredFacility = res?.map((f: any) => f.facilityType);

        const isOnboarded = res?.some(
          (f: any) => f.facilityType === facilityType
        );

        if (!isOnboarded) {
          this.isFacilityModalOpen = false;
          this.confirmSwitchModalOpen = true;
        } else {
          this.isFacilityModalOpen2 = true;
        }
      });
    this.selected = facilityType;
    this.onBoardFacility = facilityType;
    this.showFacilityList(facilityType);
  }

  loadProfile(facilityType: any) {
    this.loaded = false;
    this.profileInfoService.picture = null;
    this.facilityType = facilityType;
    this.profileInfoService.name = this.facilityType;
    this.api
      .getFacilityTypesOfFacility({ facilityId: this.facilityId } as any)
      .pipe(
        takeUntil(this.destroy$),
        filter((res) => !!res)
      )
      .subscribe((res: any) => {
        this.initialFacilityData = res;
        this.registeredFacility = res.map(
          (facility: any) => facility.facilityType
        );

        const selected = res.find(
          (facility: any) => facility.facilityType === this.facilityType
        );

        if (selected && this.facilityTypeId != null) {
          this.activeFacilityType = this.facilityType;
          this.bgColor = '#FFFFFF';
          this.profilePicture();
        } else {
          this.loaded = true;
        }
      });
  }

  showFacilityList(facilityType: string) {
    this.allFacilities = this.initialFacilityData
      .filter((item: any) => item.facilityType === facilityType)
      .map((res: any, index: any) => {
        if (index === 0) {
          this.selectedFacilityName = res.facilityName + ' ' + res.facilityType;
        }
        res.check =
          this.selectedFacilityName.toLocaleLowerCase() ===
          res.name.toLocaleLowerCase()
            ? true
            : false;
        return res;
      });

    this.selectedFacility = this.allFacilities[0] ?? null;
    this.whichFacilityType = facilityType;
    if (this.allFacilities.length === 0) {
      this.confirmSwitchModalOpen = true;
    }
  }

  profilePicture() {
    this.api
      .getUploads({ referencedDocumentId: this.facilityTypeId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const lastUpload = response?.[response.length - 1];
          this.profileInfoService.picture =
            lastUpload?.name === 'Upload Picture' ? lastUpload.url : null;
        },
        error: () => {
          this.profileInfoService.picture = null;
          this.loaded = true;
        },
        complete: () => {
          this.loaded = true;
        },
      });
  }

  isRegistered(facilityType: string): boolean {
    return this.registeredFacility.includes(facilityType);
  }

  openModal() {
    if (this.getAuth?.userType === 'Medical Facility') {
      this.isFacilityModalOpen = true;
    }
  }

  setFacilityType(type: string, facility: any) {
    this.isFacilityModalOpen2 = false;
    this.selectedFacilityType = type;
    this.api
      .getFacilityTypesOfFacility({ facilityId: this.facilityId } as any)
      .subscribe((res: any) => {
        this.registeredFacility = res?.map((f: any) => f.facilityType);

        const isOnboarded = res?.some((f: any) => f.facilityType === type);

        if (!isOnboarded) {
          this.isFacilityModalOpen = false;
          this.confirmSwitchModalOpen = true;
          this.onBoardFacility = type;
          return;
        }
        localStorage.setItem(
          'facilityTypeId',
          JSON.stringify(
            facility.hospitalId ??
              facility.pharmacyId ??
              facility.radiologyId ??
              facility.laboratoryId ??
              facility.bloodBankId
          )
        );
        this.activeFacilityType = type;
        this.facilityTypeService.setFacilityType(type);
        this.facilityType = type;
        this.router
          .navigateByUrl('/dashboard/orders', {
            skipLocationChange: true,
          })
          .then(() => {
            this.router.navigateByUrl('/dashboard/home');
          });
        this.isFacilityModalOpen = false;
      });
  }

  confirmSwitch() {
    this.isFacilityModalOpen2 = false;
    this.confirmSwitchModalOpen = false;
    setTimeout(() => {
      this.isFacilityModalOpen = false;
    }, 100);

    setTimeout(() => {
      this.router.navigate([
        `/dashboard/${this.onBoardFacility
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')}-onboarding`,
        this.facilityId,
        v4(),
      ]);
    }, 900);
  }
  cancelSwitch() {
    this.confirmSwitchModalOpen = false;
  }

  selectProfile() {
    setTimeout(() => {
      this.loadedd = true;
    }, 3000);
    this.open = !this.open;
  }
  close() {
    this.open = !this.open;
  }
  continue() {
    this.open = !this.open;
    this.completeModal = !this.completeModal;
    this.loadedd = false;
  }

  closeModal() {
    this.completeModal = false;
  }

  route(event: Event) {
    event.stopPropagation();
    this.router.navigateByUrl('/dashboard/notifications');
  }
  // confirmSwitch() {
  //   this.completeModal = false;
  // }

  routeTwo() {
    // this.router.navigateByUrl('/dashboard/prescription');
  }

  goToProfile() {
    this.router.navigate([
      'dashboard',
      'more',
      this.facilityType,
      this.facilityId,
      this.facilityTypeId,
    ]);
  }

  navigateTo(route: string) {
    let path: any[] = [];

    switch (route) {
      case 'doctor':
        path = ['dashboard', 'doctors'];
        break;

      case 'nurse':
        path = ['dashboard', 'nurses'];
        break;

      case 'patient':
        path = ['dashboard', 'patients'];
        break;

      case 'pharm':
        path = ['dashboard', 'pharms'];
        break;

      case 'lab':
        path = ['dashboard', 'labstaffs'];
        break;

      case 'blood-bank':
        path = ['dashboard', 'bbstaff'];
        break;

      default:
        path = ['dashboard', 'radiologystaff'];
        break;
    }

    this.router.navigate(path);
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'morning';
    } else if (hour < 18) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  }

  logout() {
    this.auth.userDetail(this.api, (auth) => {
      const sessionId = auth?.sessionId as any;
      this.api.destroySession({ sessionId: sessionId }).subscribe(() => {
        this.toastr.show('Logged out successfully', 'success');
        this.auth.logout();
      });
    });
  }
}
