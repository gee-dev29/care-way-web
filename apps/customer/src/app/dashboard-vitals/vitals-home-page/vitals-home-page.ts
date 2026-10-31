import { Component, inject, OnDestroy } from '@angular/core';
import {
  IonCard,
  IonContent,
  IonSkeletonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { HealthCard } from '../health-card/health-card';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '@care-way/api';
import moment from 'moment';
import {
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { StorageService } from '@care-way/ui';
import { AuthService, LimitSize } from '@care-way/shared';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  addOutline,
  attachOutline,
  chevronBackOutline,
} from 'ionicons/icons';
@Component({
  selector: 'app-vitals-home-page',
  imports: [
    IonContent,
    IonCard,
    HealthCard,
    IonSkeletonText,
    CommonModule,
    IonIcon,
    RouterLink,
  ],
  templateUrl: './vitals-home-page.html',
  styleUrl: './vitals-home-page.css',
})
export class VitalsHomePage {
  private router = inject(Router);
  private api = inject(ApiService);
  private storageService = inject(StorageService);
  private auth = inject(AuthService);
  private destroy$ = new Subject<void>();

  isLoading = false;
  items: any = [];

  constructor() {
    addIcons({
      addOutline,
      addCircleOutline,
      attachOutline,
      chevronBackOutline,
    });
  }

  ionViewWillEnter() {
    this.destroy$ = new Subject<void>();
    this.auth.userDetail(this.api, (auth) => {
      const jti = auth?.jti;

      this.isLoading = false;
      setTimeout(() => {
        this.isLoading = true;
      }, 1000);

      this.initializeVitalsList();

      if (!this.storageService.getUser()) {
        this.api
          .getMembers({
            referencedDocumentId: jti,
            skip: 0,
            limit: LimitSize.DropDown,
          } as any)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            if (res?.data?.length) {
              this.storageService.setUser(res.data[0].memberId);
            }
          });
      }
    });
  }

  private initializeVitalsList() {
    this.storageService.user$
      .pipe(
        takeUntil(this.destroy$),
        filter((user) => !!user),
        tap(() => {
          this.items = [
            {
              title: 'Blood Pressure',
              subtitle$: this.getEachRecord('Blood Pressure'),
              icon: '/logo/bloodPressure.svg',
              bg: '#E15E49',
              url: 'dashboard/vitals/blood-pressure-record/Customer',
            },
            {
              title: 'Temperature',
              subtitle$: this.getEachRecord('Temperature'),
              icon: '/logo/temperature.svg',
              bg: '#3C4CCB',
              url: 'dashboard/vitals/temperature-record/Customer',
            },
            {
              title: 'Glucose Level',
              subtitle$: this.getEachRecord('Glucose'),
              icon: '/logo/glucoseLevel.svg',
              bg: '#92A3A8',
              url: 'dashboard/vitals/glucose-type/Customer',
            },
            {
              title: 'Weight',
              subtitle$: this.getEachRecord('Weight'),
              icon: '/logo/height.svg',
              bg: '#977F30',
              url: 'dashboard/vitals/weight-record/Customer',
            },
            {
              title: 'Height',
              subtitle$: this.getEachRecord('Height'),
              icon: '/logo/weight.svg',
              bg: '#7A57C9',
              url: 'dashboard/vitals/height-record/Customer',
            },
            {
              title: 'Oxygen Saturation',
              subtitle$: this.getEachRecord('Oxygen Saturation'),
              icon: '/logo/oxygenSaturation.svg',
              bg: '#AC3434',
              url: 'dashboard/vitals/oxygen-saturation-record/Customer',
            },
          ];
        })
      )
      .subscribe();
  }

  getEachRecord(vital: string): Observable<string> {
    return this.storageService.user$.pipe(
      takeUntil(this.destroy$),
      filter((user) => !!user),
      switchMap((user) =>
        this.api.getMemberVitalSignHistory({
          memberId: user,
          vitalSign: vital as any,
        })
      ),
      map((response: any[]) => {
        if (response?.length) {
          return moment
            .utc(`${response[0].date} ${response[0].time}`)
            .local()
            .fromNow();
        }
        return 'No record yet';
      })
    );
  }

  symptoms() {
    this.router.navigateByUrl('/dashboard/vitals/symptoms/Customer');
  }

  ionViewWillLeave(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
