import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  IonContent,
  IonText,
  IonBadge,
  IonCardContent,
  IonCard,
} from '@ionic/angular/standalone';
import { VitalRecordsCard } from '../vital-records-card/vital-records-card';
import {
  filter,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { StorageService } from '../storage-service';
import moment from 'moment';

@Component({
  selector: 'ui-height-record',
  imports: [
    IonContent,
    IonText,
    VitalRecordsCard,
    IonBadge,
    IonCardContent,
    IonCard,
    CommonModule,
  ],
  templateUrl: './height-record.html',
  styleUrl: './height-record.css',
})
export class HeightRecord implements OnChanges, OnDestroy, OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  @Input() auth: any;

  public storageService = inject(StorageService);
  private destroy$ = new Subject<void>();
  @Input() api: any;
  @Input() vitalSignType: any;
  @Input() profileInfoService: any;

  module: string | null;
  memberId: string | null = null;
  records$: Observable<any>;
  loading: boolean;

  record: any;
  records: any[] = [];
  isDOBPresent: any;

  ngOnChanges() {
    this.load();
  }
  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.module = params.module;
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter(() =>
          this.router.url.includes('/dashboard/vitals/height-record')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.load();
      });
  }

  load() {
    this.auth.userDetail(this.api, (auth: any) => {
      this.storageService.user$
        .pipe(
          takeUntil(this.destroy$),
          filter((user) => !!user),
          tap((user: any) => {
            this.memberId = user;
            this.api
              .getMembers({
                referencedDocumentId: auth?.jti,
              })
              .subscribe((res: any) => {
                const dob = res?.data?.[0]?.dob;
                this.isDOBPresent = !!dob?.length;
              });
          }),
          switchMap((user) =>
            user ? this.getMemberVitalSignHistory(user) : of(null)
          ),
          switchMap((user) => (this.memberId = user))
        )
        .subscribe();
    });
  }

  newDateFormat(dateStr: any, time: any) {
    return moment.utc(`${dateStr} ${time}`).local().fromNow();
  }

  getMemberVitalSignHistory(memberId: string): Observable<any> {
    return (this.records$ = this.api.getMemberVitalSignHistory({
      memberId: memberId,
      vitalSign: this.vitalSignType,
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addHeight() {
    if (this.module && this.isDOBPresent) {
      this.router.navigateByUrl('/dashboard/vitals/add-height/' + this.module);
    } else {
      this.router.navigateByUrl(
        `dashboard/profile-information/Height/${this.module}`
      );
    }
  }
}
