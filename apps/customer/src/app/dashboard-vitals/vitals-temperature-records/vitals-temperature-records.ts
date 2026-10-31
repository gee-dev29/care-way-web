import { Component, inject, OnDestroy } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { StorageService, TemperatureRecord } from '@healbridge/ui';
import { filter, map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-vitals-temperature-records',
  imports: [TemperatureRecord],
  templateUrl: './vitals-temperature-records.html',
  styleUrl: './vitals-temperature-records.css',
})
export class VitalsTemperatureRecords implements OnDestroy {
  public api = inject(ApiService);
  vitalSignType=VitalSignType.Temperature;
  private destroy$ = new Subject<void>();
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
        map(() => VitalSignType.Temperature)
      )
      .subscribe();
    this.storageService.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
