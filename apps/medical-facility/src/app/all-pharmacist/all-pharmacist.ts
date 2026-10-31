import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { AuthService, FacilityTypeService } from '@healbridge/shared';
import { SharedAllMember } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-all-pharmacist',
  imports: [SharedAllMember, IonContent],
  templateUrl: './all-pharmacist.html',
  styleUrl: './all-pharmacist.css',
})
export class AllPharmacist implements OnDestroy {
  facilityType = FacilityType.Pharmacy;
  FacilityType = FacilityType;
  addRoute: any;
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  public auth = inject(AuthService);
  routeTo: any;
  cardColor = '#E2EEE5';
  private destroy$ = new Subject<void>();
  private facilityTypeService = inject(FacilityTypeService);

  ionViewWillEnter(): void {
    this.auth.userDetail(this.api, (auth) => {
      const facilityId = auth?.userTypeId;
      this.facilityTypeService.facilityType$
        .pipe(takeUntil(this.destroy$))
        .subscribe((type: any) => {
          this.facilityType = type;
          this.addRoute = `/dashboard/add-pharmacist/${this.facilityType}/${facilityId}`;
          this.routeTo = `/dashboard/pharmacist-profile/${this.facilityType}/${facilityId}`;
        });
    });
    this.facilityTypeService.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
