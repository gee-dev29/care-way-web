import { Component, inject, OnDestroy } from '@angular/core';
import { ApiService, VitalSignType } from '@healbridge/api';
import { ProfileInfoService, TestingType } from '@healbridge/shared';
import { GlucoseRecord, StorageService } from '@healbridge/ui';
import { Subject, takeUntil, filter, map } from 'rxjs';

@Component({
  selector: 'app-vitals-glucose-record',
  imports: [GlucoseRecord],
  templateUrl: './vitals-glucose-record.html',
  styleUrl: './vitals-glucose-record.css',
})
export class VitalsGlucoseRecord implements OnDestroy {
  public api = inject(ApiService);
  vitalSignType = VitalSignType.Glucose;
  public profileInfoService = inject(ProfileInfoService);
  private destroy$ = new Subject<void>();

  public storageService = inject(StorageService);
  ionViewWillEnter() {
    this.load();
  }

  load() {
    this.storageService.user$
      .pipe(
        takeUntil(this.destroy$),
        filter(Boolean),
        map(() => (this.vitalSignType = VitalSignType.Glucose))
      )
      .subscribe();
    this.storageService.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
