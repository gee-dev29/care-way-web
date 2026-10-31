import { Component, inject, OnDestroy } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { SharedAllMember } from '@healbridge/ui';
import { ApiService, FacilityType, ProfessionalType } from '@healbridge/api';
import { AuthService, FacilityTypeService } from '@healbridge/shared';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-view-all-nurses',
  imports: [IonContent, SharedAllMember],
  templateUrl: './view-all-nurses.html',
  styleUrl: './view-all-nurses.css',
})
export class ViewAllNurses implements OnDestroy {
  facilityType = FacilityType.Hospital;
  FacilityType = FacilityType;
  ProfessionalType = ProfessionalType;
  addRoute: any;
  routeTo: any;
  public auth = inject(AuthService);
  public api = inject(ApiService);
  private destroy$ = new Subject<void>();
  private facilityTypeService = inject(FacilityTypeService);

  ionViewWillEnter(): void {
    this.auth.userDetail(this.api, (auth) => {
      const facilityId = auth?.userTypeId;
      this.facilityTypeService.facilityType$
        .pipe(takeUntil(this.destroy$))
        .subscribe((type: any) => {
          this.facilityType = type;
          this.addRoute = `dashboard/add-nurse/${this.facilityType}/${facilityId}`;
          this.routeTo = `dashboard/nurse-profile/${this.facilityType}/${facilityId}`;
        });
    });
    this.facilityTypeService.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
