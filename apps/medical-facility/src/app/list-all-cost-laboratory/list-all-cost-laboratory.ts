import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ApiService, FacilityType } from '@healbridge/api';
import { AuthService, FacilityTypeService } from '@healbridge/shared';
import { ListAllCost } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-list-all-cost-laboratory',
  imports: [ListAllCost, IonContent],
  templateUrl: './list-all-cost-laboratory.html',
  styleUrl: './list-all-cost-laboratory.css',
})
export class ListAllCostLaboratory {
  facilityType: string;
  FacilityType = FacilityType;
  api = inject(ApiService);
  auth = inject(AuthService);
  facilityService = inject(FacilityTypeService);
  facilityTypeService = inject(FacilityTypeService);
  private destroy$ = new Subject<void>();

  ionViewWillEnter() {
    this.destroy$ = new Subject<void>();
    this.auth.userDetail(this.api, (auth) => {
      const facilityId = auth?.userTypeId;
      this.facilityTypeService.facilityType$
        .pipe(takeUntil(this.destroy$))
        .subscribe((type) => {
          this.facilityType = type;
        });
      if (!this.facilityTypeService.getFacilityType()) {
        this.api
          .getFacilityTypesOfFacility({ facilityId } as any)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            const type = res?.[0]?.facilityType ?? null;
            this.facilityType = type;
            this.facilityTypeService.setFacilityType(type);
          });
      }
    });
    this.facilityTypeService.refresh();
  }

  ionViewWillLeave(): void {
    this.destroy$.next();
  }
}
