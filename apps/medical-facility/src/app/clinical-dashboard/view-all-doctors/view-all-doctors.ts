import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { SharedAllMember } from '@care-way/ui';
import { ApiService, FacilityType, ProfessionalType } from '@care-way/api';
import { AuthService, FacilityTypeService, NurseActiveFacility } from '@care-way/shared';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-view-all-doctors',
  imports: [IonContent, SharedAllMember],
  templateUrl: './view-all-doctors.html',
  styleUrl: './view-all-doctors.css',
})
export class ViewAllDoctors implements OnDestroy {
  facilityType = FacilityType.Hospital;
  FacilityType = FacilityType;
  ProfessionalType = ProfessionalType;
  addRoute: any;
  public auth = inject(AuthService);
  private destroy$ = new Subject<void>();
  private facilityTypeService = inject(FacilityTypeService);
  private activatedRoute = inject(ActivatedRoute);
  private nurseActiveFacility = inject(NurseActiveFacility);
  public api = inject(ApiService);
  routeTo: any;
  isNurse = false;
  showAdd = true;
  backRoute: string | undefined;
  activeFacilityTypeId: string | undefined;

  ionViewWillEnter(): void {
    const professionalId = this.activatedRoute.snapshot.paramMap.get(
      'professionalId'
    );

    if (professionalId) {
      this.isNurse = true;
      this.showAdd = false;
      this.backRoute = `/nurse-dashboard/${professionalId}`;
      this.routeTo = `/nurse-dashboard/${professionalId}/doctor-profile`;
      this.nurseActiveFacility.activeFacilityTypeId$
        .pipe(takeUntil(this.destroy$))
        .subscribe((facilityTypeId) => {
          this.activeFacilityTypeId = facilityTypeId ?? undefined;
        });
      return;
    }

    this.auth.userDetail(this.api, (auth) => {
      const facilityId = auth?.userTypeId;
      this.facilityTypeService.facilityType$
        .pipe(takeUntil(this.destroy$))
        .subscribe((type: any) => {
          this.facilityType = type;
          this.addRoute = `dashboard/add-doctor/${this.facilityType}/${facilityId}`;
          this.routeTo = `dashboard/doctor-profile/${this.facilityType}/${facilityId}`;
        });
    });
    this.facilityTypeService.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
