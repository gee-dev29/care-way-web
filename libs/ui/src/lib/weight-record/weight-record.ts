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
  selector: 'ui-weight-record',
  imports: [
    IonContent,
    IonText,
    VitalRecordsCard,
    IonBadge,
    IonCardContent,
    IonCard,
    CommonModule,
  ],
  templateUrl: './weight-record.html',
  styleUrl: './weight-record.css',
})
export class WeightRecord implements OnChanges, OnDestroy, OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  @Input() auth: any;

  public storageService = inject(StorageService);
  @Input() api: any;
  @Input() vitalSignType: any;
  @Input() profileInfoService: any;

  term = new FormControl(false);
  module: string | null;
  memberId: string | null = null;
  private destroy$ = new Subject<void>();
  record: any;
  records: any[] = [];
  records$: Observable<any>;
  isDOBPresent: any;
  loading: boolean;

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
          this.router.url.includes('/dashboard/vitals/weight-record')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.load();
      });
  }

  load() {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
    });
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

  addWeight() {
    if (this.module && this.isDOBPresent) {
      this.router.navigateByUrl('/dashboard/vitals/add-weight/' + this.module);
    } else {
      this.router.navigateByUrl(
        `dashboard/profile-information/Weight/${this.module}`
      );
    }
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
}
