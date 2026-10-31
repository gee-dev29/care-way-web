import { Component, inject, OnDestroy } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { AuthService, ProfileInfoService } from '@healbridge/shared';
import { StorageService, WeightRecord } from '@healbridge/ui';
import { filter, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-vitals-weight-records',
  imports: [WeightRecord],
  templateUrl: './vitals-weight-records.html',
  styleUrl: './vitals-weight-records.css',
})
export class VitalsWeightRecords implements OnDestroy {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Weight;
  private destroy$ = new Subject<void>();
  public profileInfoService = inject(ProfileInfoService);
  public storageService = inject(StorageService);
  auth = inject(AuthService);
  ionViewWillEnter() {
    this.load();
  }

  load() {
    this.storageService.user$
      .pipe(
        takeUntil(this.destroy$),
        filter(Boolean),
        map(() => (this.vitalSignType = VitalSignType.Weight))
      )
      .subscribe();
    this.storageService.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
