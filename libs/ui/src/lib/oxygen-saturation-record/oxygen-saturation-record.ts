import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
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
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { StorageService } from '../storage-service';
import moment from 'moment';

@Component({
  selector: 'ui-oxygen-saturation-record',
  imports: [
    IonContent,
    VitalRecordsCard,
    IonText,
    IonBadge,
    IonCardContent,
    IonCard,
    CommonModule,
  ],
  templateUrl: './oxygen-saturation-record.html',
  styleUrl: './oxygen-saturation-record.css',
})
export class OxygenSaturationRecord
  implements OnChanges, OnDestroy, AfterViewInit, OnInit
{
  @ViewChild('spo2Canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('spo2Canvas2') canvas2!: ElementRef<HTMLCanvasElement>;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  @Input() auth: any;

  public storageService = inject(StorageService);
  @Input() api: any;
  @Input() VitalSignType: any;
  @Input() profileInfoService: any;
  private destroy$ = new Subject<void>();
  records$: Observable<any>;
  recordsPulse$: Observable<any>;
  module: string | null;
  memberId: string;
  vitalRecordId: string;
  isDOBPresent: any;
  loading: boolean;

  ngAfterViewInit() {
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Tooltip,
      Legend
    );

    setTimeout(() => {
      new Chart(this.canvas.nativeElement, {
        type: 'line',
        data: {
          labels: Array.from({ length: 60 }, (_, i) => `${i + 1}m`),
          datasets: [
            {
              label: 'Oxygen Saturation Over Time SpO₂',
              data: [
                98.1, 97.4, 98.3, 97.8, 98.7, 98.2, 98.9, 98.1, 97.9, 98.2,
                97.4, 97.8, 98.4, 98.1, 97.9,
              ],
              borderColor: '#F59E0B',
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }, 1000);
  }

  // ngOnInit(): void {
  //   this.route.params.subscribe((params: any) => {
  //     this.module = params.module;
  //     this.storageService.user$.subscribe((user) => {
  //       this.memberId = user;
  //       this.getOxygenSaturationHistory(this.memberId);
  //     });
  //     if (params.vitalRecordId) {
  //       this.vitalRecordId = params.vitalRecordId;
  //     }
  //   });
  //   this.api
  //     .getMembers({
  //       referencedDocumentId: this.auth.userDetail(this.api)?.jti,
  //     })
  //     .subscribe((res: any) => {
  //       const dob = res?.data?.[0]?.dob;
  //       this.isDOBPresent = !!dob?.length;
  //     });
  // }

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
          this.router.url.includes('/dashboard/vitals/oxygen-saturation-record')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.load();
      });

    this.load();
  }

  ngOnChanges() {
    this.load();
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
            user ? this.getOxygenSaturationHistory(user) : of(null)
          ),
          switchMap((user) => (this.memberId = user))
        )
        .subscribe();
    });
  }

  getOxygenSaturationHistory(memberId: any): Observable<any> {
    this.records$ = this.api
      .getMemberVitalSignHistory({
        memberId: memberId,
        vitalSign: this.VitalSignType.OxygenSaturation,
      })
      .pipe(
        map((response: any) => {
          const record: any = [];
          response.forEach((res: any) => {
            res.color = this.getColor(res.record);
            record.push(res);
          });
          return record;
        })
      );
    this.recordsPulse$ = this.api.getMemberVitalSignHistory({
      memberId: memberId,
      vitalSign: this.VitalSignType.Pulse,
    });
    return this.records$;
  }

  newDateFormat(dateStr: string, time: any) {
    return moment.utc(`${dateStr} ${time}`).local().fromNow();
  }

  addSp() {
    if (this.module && this.isDOBPresent) {
      this.router.navigateByUrl(
        '/dashboard/vitals/add-oxygen-saturation/' + this.module
      );
    } else {
      this.router.navigateByUrl(
        `dashboard/profile-information/OS/${this.module}`
      );
    }
  }

  getEquality(value: number): string {
    if (value >= 95) {
      return '≥ 95';
    }

    if (value >= 90 && value <= 94) {
      return '(90–94)';
    }

    return '< 90';
  }
  getColor(value: number): string {
    if (value >= 95) {
      return '#009446';
    }

    if (value >= 90 && value <= 94) {
      return '#FFA500)';
    }

    return '#FF0000';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
