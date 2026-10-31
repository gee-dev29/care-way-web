import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonText,
  IonBadge,
  IonCardContent,
  IonCard,
} from '@ionic/angular/standalone';
import { VitalRecordsCard } from '../vital-records-card/vital-records-card';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject } from 'rxjs';
import { StorageService } from '../storage-service';

@Component({
  selector: 'ui-glucose-record',
  imports: [
    IonContent,
    IonText,
    VitalRecordsCard,
    IonBadge,
    IonCardContent,
    IonCard,
    CommonModule,
  ],
  templateUrl: './glucose-record.html',
  styleUrl: './glucose-record.css',
})
export class GlucoseRecord implements OnChanges, OnDestroy {
  router = inject(Router);
  storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  @Input() api: any;
  @Input() vitalSignType: any;
  @Input() profileInfoService: any;

  module: string | null;
  vitalType: any;
  memberId: string;

  records$: Observable<any>;
  range: string;

  cardIcon = '/logo/recordVitalsBlood.svg';
  term = new FormControl(false);
  title: string;
  goBack: string;
  loading: boolean;

  ngOnChanges() {
    this.load();
  }
  load() {
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
      this.initPage();
    });

    this.title = `Record ${this.vitalType} Vitals`;
  }

  ionViewWillEnter() {
    this.storageService.user$.subscribe((user) => {
      this.memberId = user;
      this.initPage();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initPage() {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      this.vitalType = params.vitalType;
    });
    this.memberId = JSON.parse(localStorage.getItem('memberId') as any);
    this.getMemberVitalSignHistory(this.memberId, this.vitalType);
    if (this.vitalType === 'Fasting' || this.vitalType === 'Random') {
      this.goBack = `/dashboard/vitals/glucose-type/${this.module}`;
    }
  }

  getEquality(status: any): any {
    let range;
    if (!status) return;
    if (status === 'Low') {
      range = 'Low (0 < 70)';
    } else if (status === 'Normal') {
      range = 'Normal (70 – 99)';
    } else {
      range = 'High (Diabetes) ≥ 126';
    }
    return range;
  }

  formatDate(dateStr: string, time: string): string {
    return moment.utc(`${dateStr} ${time}`).local().fromNow();
  }

  getMemberVitalSignHistory(memberId: string, vitalType: any) {
    this.records$ = this.api
      .getMemberVitalSignHistory({
        memberId,
        vitalSign: this.vitalSignType,
      })
      .pipe(
        map((records: any[]) =>
          records.filter(
            (item) => item.readings?.[0]?.testingType === vitalType
          )
        )
      );
  }
  navigateTo() {
    if (this.module && this.vitalType) {
      if (this.vitalType === 'Fasting') {
        this.router.navigateByUrl(`/dashboard/vitals/fasting/${this.module}`);
      } else if (this.vitalType === 'Random') {
        this.router.navigateByUrl(`/dashboard/vitals/random/${this.module}`);
      } else if (this.vitalType === 'OGTT') {
        this.router.navigateByUrl(`/dashboard/vitals/ogtt/${this.module}`);
      } else {
        this.router.navigateByUrl(
          `/dashboard/vitals/post-prandial/${this.module}`
        );
      }
    }
  }
}
