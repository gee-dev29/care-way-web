import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '@care-way/api';
import {
  AuthService,
  LimitSize,
  ProfileInfoService,
  ToastService,
} from '@care-way/shared';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { ButtonComponent, StorageService } from '@care-way/ui';
import { addNotification, notifications$ } from '../notification/notification';
import {
  IonAvatar,
  IonBadge,
  IonCardContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonRouterOutlet,
  IonSkeletonText,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bagHandleOutline,
  close,
  notificationsOutline,
  powerOutline,
} from 'ionicons/icons';
import { PushService } from '@care-way/ui';
import {
  catchError,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-dashboard',
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
    ButtonComponent,
    IonModal,
    CommonModule,
    IonCardContent,
    IonText,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Dashboard implements OnDestroy, OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  api = inject(ApiService);
  private storageService = inject(StorageService);
  public profileInfoService: any = inject(ProfileInfoService);
  allMembers$: Observable<any[]> = of([]);
  loaded: any = false;
  loadedd: any = false;
  open = false;
  completeModal = false;
  currentChildRoute = '';
  showHeader = true;
  showTab = true;
  private toastr = inject(ToastService);
  memberId: string;
  private destroy$ = new Subject<void>();
  currentRoute = '';
  isMobile = window.innerWidth < 768;
  loading: boolean;
  private push = inject(PushService);
  unreadNotificationCount = 0;

  constructor() {
    addIcons({
      notificationsOutline,
      close,
      'bag-handle-outline': bagHandleOutline,
      powerOutline,
    });
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.showHeader = !url.includes('preview-video');
        this.showTab = !url.includes('preview-video');
      }
    });
    notifications$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.unreadNotificationCount = items.filter((item) => !item.read).length;
    });
    this.push.initialize(this.api, 'Customer', (notification) => {
      addNotification({
        notificationId: (notification as any).notificationId,
        title: notification.title,
        body: notification.body,
      });
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit(): void {
    this.load();
  }

  ionViewWillEnter() {
    this.load();
  }

  async load() {
    this.isMobile = window.innerWidth < 768;
    this.auth.userDetail(this.api, (auth) => {
      if (auth?.userType !== 'Default') {
        this.toastr.show("You can't use this credential on this app", 'error');
        localStorage.removeItem('memberId');
        this.auth.logout();
      } else {
        const jti = auth?.jti;
        if (!this.storageService.getUser()) {
          this.api
            .getMembers({
              referencedDocumentId: jti,
              skip: 0,
              limit: LimitSize.DropDown,
            } as any)
            .pipe(
              takeUntil(this.destroy$),
              tap((user: any) => {
                this.storageService.setUser(user?.data[0]?.memberId);
                this.loaded = false;
              }),
              switchMap((user: any) =>
                user ? this.loadProfile(user.data[0].memberId) : of(null)
              ),
              switchMap(() => this.loadMembers())
            )
            .subscribe();
        } else {
          this.storageService.user$
            .pipe(
              takeUntil(this.destroy$),
              filter((user) => !!user),
              tap(() => (this.loaded = false)),
              switchMap((user) => (user ? this.loadProfile(user) : of(null))),
              switchMap(() => this.loadMembers())
            )
            .subscribe();
        }
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

  loadProfile(userId: any): Observable<any> {
    return this.api.getMember({ memberId: userId }).pipe(
      switchMap((res: any) => {
        return this.getProfilePicture(res.memberId).pipe(
          tap((url: any) => {
            this.profileInfoService.name = res.firstName
              ? `${res.firstName} ${res.lastName}`
              : res.name;
            this.profileInfoService.picture = url;
          }),
          map(() => res)
        );
      })
    );
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

  loadMembers(): Observable<any[]> {
    this.auth.userDetail(this.api, (auth) => {
      const jti = auth?.jti;
      this.allMembers$ = this.api
        .getMembers({
          referencedDocumentId: jti,
          skip: 0,
          limit: LimitSize.DropDown,
        } as any)
        .pipe(
          switchMap((res: any) => {
            const members = res.data || [];
            if (!members.length) return of([]);
            return forkJoin(
              members.map((member: any) =>
                this.getProfilePicture(member.memberId).pipe(
                  map((url) => ({ ...member, profilePicture: url })),
                  catchError(() => of({ ...member, profilePicture: null }))
                )
              )
            );
          }),
          tap((result: any) => {
            this.loaded = true;
          }),
          takeUntil(this.destroy$)
        );
    });

    return this.allMembers$;
  }

  getProfilePicture(referencedDocumentId: string): Observable<string | null> {
    return this.api.getUploads({ referencedDocumentId }).pipe(
      map((res: any[]) => (res?.length ? res[res.length - 1].url : null)),
      catchError(() => of(null))
    );
  }

  selectProfile() {
    setTimeout(() => (this.loadedd = true), 3000);
    this.open = !this.open;
  }

  close() {
    this.open = !this.open;
  }

  continue() {
    if (!this.memberId || this.memberId == '') {
      this.toastr.show('Please select a member', 'error');
      return;
    }
    this.loading = true;
    this.storageService.setUser(this.memberId);
    setTimeout(() => {
      this.loadProfile(this.memberId).subscribe({
        next: () => {
          this.open = !this.open;
          this.toastr.show('Member Switched Successfully', 'success');
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }, 300);
  }

  closeModal() {
    this.completeModal = false;
  }

  route(event: Event) {
    event.stopPropagation();
    this.router.navigateByUrl('/dashboard/notifications');
  }

  routeTwo(event: Event) {
    event.stopPropagation();
    this.router.navigateByUrl('/dashboard/vitals');
  }

  isSwitchIt(memberId: string) {
    this.memberId = memberId;
  }

  getTimeOfDay(): string {
    const hour = new Date().getHours();
    return hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
