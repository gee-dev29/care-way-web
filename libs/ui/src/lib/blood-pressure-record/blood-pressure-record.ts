import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  IonContent,
  IonText,
  IonBadge,
  IonCardContent,
  IonCard,
  IonIcon,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { VitalRecordsCard } from '../vital-records-card/vital-records-card';
import {
  filter,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { ToastService } from '../toast';
import { StorageService } from '../storage-service';
import moment from 'moment';

@Component({
  selector: 'ui-blood-pressure-record',
  imports: [
    CommonModule,
    IonContent,
    IonText,
    VitalRecordsCard,
    IonBadge,
    IonCardContent,
    IonCard,
  ],
  templateUrl: './blood-pressure-record.html',
  styleUrl: './blood-pressure-record.css',
})
export class BloodPressureRecord implements OnChanges, OnDestroy, OnInit {
  private router = inject(Router);
  public storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  @Input() auth: any;
  @Input() api: any;
  @Input() profileInfoService: any;
  private destroy$ = new Subject<void>();
  @Input() vitalSignType: any;
  private toastr = inject(ToastService);
  cardIcon = '/icons/Blood-pressure-icon.svg';
  term = new FormControl(false);
  module: string | null;
  memberId: string;
  records$: Observable<any>;
  records: any[] = [];
  loggedInuserId: any;
  isDOBPresent: any;
  loading: boolean;

  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
    });
  }

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
          this.router.url.includes('/dashboard/vitals/blood-pressure-record')
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
          tap((user) => {
            this.memberId = user.memberId;
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
            user ? this.getBloodPressureHistory(user) : of(null)
          ),

          switchMap((user) => (this.memberId = user))
        )
        .subscribe();
    });

    // this.storageService.refresh();
  }

  getBloodPressureHistory(memberId: any): Observable<any> {
    return (this.records$ = this.api
      .getMemberVitalSignHistory({
        memberId: memberId,
        vitalSign: this.vitalSignType.BloodPressure,
      })
      .pipe(tap((response: any) => (this.records = response))));
  }

  newDateFormat(dateStr: any, time: any) {
    return moment.utc(`${dateStr} ${time}`).local().fromNow();
  }

  getBpRangeText(systolic: number, diastolic: number): string {
    switch (true) {
      case systolic < 120 && diastolic < 80:
        return 'Systolic < 120, Diastolic < 80';

      case systolic > 120 && systolic < 129 && diastolic < 80:
        return 'Systolic 120-129, Diastolic < 80';

      case systolic > 130 || diastolic > 80:
        return 'Systolic > 130 or Diastolic > 80';

      default:
        return '';
    }
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'Normal':
        return 'status-normal';
      case 'Elevated':
        return 'status-elevated';
      case 'High':
        return 'status-high';
      default:
        return 'status-default';
    }
  }

  addNewBp() {
    if (this.module && this.isDOBPresent) {
      this.router.navigateByUrl('/dashboard/vitals/add-bp/' + this.module);
    } else {
      this.router.navigateByUrl(
        `dashboard/profile-information/BP/${this.module}`
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
