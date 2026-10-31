import { Component, inject, OnDestroy } from '@angular/core';
import { ApiService, VitalSignType } from '@care-way/api';
import { AuthService, ProfileInfoService } from '@care-way/shared';
import { OxygenSaturationRecord, StorageService } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';
import { filter, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-records-oxygen-saturation',
  imports: [OxygenSaturationRecord, IonContent],
  templateUrl: './records-oxygen-saturation.html',
  styleUrl: './records-oxygen-saturation.css',
})
export class RecordsOxygenSaturation implements OnDestroy {
  public api = inject(ApiService);
  VitalSignType = VitalSignType;
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
        map(() => (this.VitalSignType = VitalSignType))
      )
      .subscribe();
    this.storageService.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
