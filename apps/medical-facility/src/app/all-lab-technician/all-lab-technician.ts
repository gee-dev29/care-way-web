import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { AuthService, FacilityTypeService } from '@healbridge/shared';
import { SharedAllMember } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-all-lab-technician',
  imports: [SharedAllMember, IonContent],
  templateUrl: './all-lab-technician.html',
  styleUrl: './all-lab-technician.css',
})
export class AllLabTechnician implements OnDestroy {
  facilityType = FacilityType.BloodBank;
  FacilityType = FacilityType;
  addRoute: any;
  private destroy$ = new Subject<void>();
  public api = inject(ApiService);
  private facilityTypeService = inject(FacilityTypeService);
  routeTo: any;
  public auth = inject(AuthService);
  cardColor = '#FEF1F1';
  border = '0.5px solid #FEC6C6';

  ionViewWillEnter(): void {
    this.auth.userDetail(this.api, (auth) => {
      const facilityId = auth?.userTypeId;
      this.facilityTypeService.facilityType$
        .pipe(takeUntil(this.destroy$))
        .subscribe((type: any) => {
          this.facilityType = type;
          this.addRoute = `/dashboard/add-lab-technician/${this.facilityType}/${facilityId}`;
          this.routeTo = `/dashboard/lab-technician-profile/${this.facilityType}/${facilityId}`;
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
