import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { FacilityType, FacilityTypeService } from '@healbridge/shared';
import { SharedEmptyBank } from '@healbridge/ui';
import { Subject, takeUntil } from 'rxjs';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'medical-facility-hospital-empty-bank',
  imports: [CommonModule, SharedEmptyBank, IonContent],
  templateUrl: './hospital-empty-bank.html',
  styleUrl: './hospital-empty-bank.css',
})
export class HospitalEmptyBank implements OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Hospital;
  pharmacyId: string;
  route: string;
  private destroy$ = new Subject<void>();
  backRoute: string;
  bankRoute: string;
  private facilityTypeService = inject(FacilityTypeService);

  ionViewWillEnter() {
    this.facilityTypeService.facilityType$
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        this.facilityType = type;
        this.activatedRoute.params.subscribe((params: any) => {
          this.facilityId = params.facilityId;
          this.pharmacyId = params.pharmacyId;
          this.route = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-add-bank`;
          this.backRoute = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-upload`;
          this.bankRoute = `/dashboard/hospital-onboarding/${this.facilityId}/${this.pharmacyId}/hospital-empty-address`;
        });
      });
    this.facilityTypeService.refresh();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
