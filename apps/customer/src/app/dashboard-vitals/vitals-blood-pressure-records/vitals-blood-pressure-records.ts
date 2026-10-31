import { Component, inject, OnDestroy } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { AuthService, ProfileInfoService } from '@care-way/shared';
import { BloodPressureRecord, StorageService } from '@care-way/ui';
import { filter, map, shareReplay, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-vitals-blood-pressure-records',
  imports: [BloodPressureRecord],
  templateUrl: './vitals-blood-pressure-records.html',
  styleUrl: './vitals-blood-pressure-records.css',
})
export class VitalsBloodPressureRecords implements OnDestroy {
  public api = inject(ApiService);
  vitalSignType = VitalSignType;
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
        map(() => (this.vitalSignType = VitalSignType))
      )
      .subscribe();
    this.storageService.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
