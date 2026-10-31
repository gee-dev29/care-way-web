import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { AuthService, FacilityTypeService } from '@healbridge/shared';
import { SharedAllMember } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-all-radiologist',
  imports: [SharedAllMember, IonContent],
  templateUrl: './all-radiologist.html',
  styleUrl: './all-radiologist.css',
})
export class AllRadiologist implements OnDestroy {
  facilityType = FacilityType.Radiology;
  FacilityType = FacilityType;
  addRoute: any;
  private activatedRoute = inject(ActivatedRoute);
  public auth = inject(AuthService);
  public api = inject(ApiService);
  private destroy$ = new Subject<void>();
  routeTo: any;
  private facilityTypeService = inject(FacilityTypeService);

  ionViewWillEnter(): void {
    this.auth.userDetail(this.api, (auth) => {
      const facilityId = auth?.userTypeId;
      this.facilityTypeService.facilityType$
        .pipe(takeUntil(this.destroy$))
        .subscribe((type: any) => {
          this.facilityType = type;
          this.addRoute = `/dashboard/add-radiologist/${this.facilityType}/${facilityId}`;
          this.routeTo = `/dashboard/radiologist-profile/${this.facilityType}/${facilityId}`;
        });
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
