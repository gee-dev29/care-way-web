import { Component, inject, OnDestroy } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { AuthService, ProfileInfoService } from '@healbridge/shared';
import { HeightRecord, StorageService } from '@healbridge/ui';
import { filter, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-vitals-height-records',
  imports: [HeightRecord],
  templateUrl: './vitals-height-records.html',
  styleUrl: './vitals-height-records.css',
})
export class VitalsHeightRecords implements OnDestroy {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Height;
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
        map(() => (this.vitalSignType = VitalSignType.Height))
      )
      .subscribe();
    this.storageService.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
