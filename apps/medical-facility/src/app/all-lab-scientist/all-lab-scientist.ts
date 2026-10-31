import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { AuthService, FacilityTypeService } from '@healbridge/shared';
import { SharedAllMember } from '@healbridge/ui';
import { IonContent } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'medical-facility-all-lab-scientist',
  imports: [SharedAllMember, IonContent],
  templateUrl: './all-lab-scientist.html',
  styleUrl: './all-lab-scientist.css',
})
export class AllLabScientist implements OnDestroy {
  facilityType = FacilityType.Laboratory;
  FacilityType = FacilityType;
  addRoute: any;
  public auth = inject(AuthService);
  private destroy$ = new Subject<void>();
  private facilityTypeService = inject(FacilityTypeService);
  public api = inject(ApiService);
  routeTo: any;
  cardColor = '#F1F9FF';
  border = '0.5px solid #05032A1A';

  ionViewWillEnter(): void {
    this.auth.userDetail(this.api, (auth) => {
      const facilityId = auth?.userTypeId;
      this.facilityTypeService.facilityType$
        .pipe(takeUntil(this.destroy$))
        .subscribe((type: any) => {
          this.facilityType = type;
          this.addRoute = `/dashboard/add-scientist/${this.facilityType}/${facilityId}`;
          this.routeTo = `/dashboard/scientist-profile/${this.facilityType}/${facilityId}`;
        });
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
