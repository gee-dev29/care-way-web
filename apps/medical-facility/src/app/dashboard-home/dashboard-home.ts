import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ApiService, FacilityType } from '@healbridge/api';
import { PharmacyDashboard } from '../pharmacy-dashboard/pharmacy-dashboard';
import { RadiologyDashboard } from '../radiology-dashboard/radiology-dashboard';
import { LabTechnicianDashboard } from '../lab-technician-dashboard/lab-technician-dashboard';
import { ManageDoctors } from '../clinical-dashboard/manage-doctors/manage-doctors';
import { ActivatedRoute, Router } from '@angular/router';
import { LabDashboard } from '../lab-dashboard/lab-dashboard';
import { AuthService, FacilityTypeService } from '@healbridge/shared';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ToastService } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-dashboard-home',
  imports: [
    PharmacyDashboard,
    RadiologyDashboard,
    LabTechnicianDashboard,
    ManageDoctors,
    LabDashboard,
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardHome implements OnDestroy, OnInit {
  route = inject(ActivatedRoute);
  auth = inject(AuthService);
  toastr = inject(ToastService);
  router = inject(Router);
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  FacilityType = FacilityType;
  private destroy$ = new Subject<void>();
  facilityType: string;
  private facilityTypeService = inject(FacilityTypeService);

  ionViewWillEnter() {
    this.load();
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    if (!this.facilityType) {
      this.facilityType = this.facilityTypeService.getFacilityType() ?? '';
    }
    this.auth.userDetail(this.api, (auth: any) => {
      const allowedRoles = [
        'Pharmacist',
        'Nurse',
        'Pharmacy Staff',
        'Blood Bank Staff',
        'Laboratory Staff',
        'Radiology Staff',
        'Medical Facility',
        'Doctor',
      ];
      const userType = (auth?.userType || '').trim();
      if (!allowedRoles.includes(userType)) {
        this.toastr.show("You can't use this credential on this app", 'error');
      } else {
        setTimeout(() => {
          const facilityId = auth?.userTypeId;
          const facilityType = JSON.parse(
            localStorage.getItem('facilityType') as any
          );
          const smallFacilityType = facilityType?.toLowerCase();
          const facilityTypeId = JSON.parse(
            localStorage.getItem('facilityTypeId') as any
          );
          if (facilityTypeId == null) {
            this.router.navigate(['dashboard', 'onboarding', facilityId]);
          } else {
            const request$ = forkJoin({
              license: this.api.getPracticeLicenses({
                referencedDocumentId: facilityTypeId,
              }),
              bank: this.api.getFacilityTypeBankAccount({
                facilityType: facilityType,
                facilityTypeId: facilityTypeId,
              }),
              address: this.api.getFacilityTypeById({
                facilityId: facilityId,
                facilityType: facilityType,
                facilityTypeId: facilityTypeId,
              }),
              patientType: this.api.getFacilityTypeMembershipCardTypes({
                facilityTypeId: facilityTypeId,
              } as any),
            }).subscribe((response) => {
              if (response.license.length == 0) {
                if (this.facilityType === this.FacilityType.Pharmacy) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/pharm-license?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.Hospital) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/hospital-license?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.Laboratory) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/laboratory-license?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.Radiology) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/radiology-license?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.BloodBank) {
                  this.router.navigateByUrl(
                    `/dashboard/blood-bank-onboarding/${facilityId}/${facilityTypeId}/'blood-bank-license-details?error=true`
                  );
                }
                return;
              }
              if (response.bank == null || response.bank == undefined) {
                if (this.facilityType === this.FacilityType.Pharmacy) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/'pharm-add-bank?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.Hospital) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/hospital-add-bank?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.Laboratory) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/laboratory-add-bank?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.Radiology) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/radiology-add-bank?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.BloodBank) {
                  this.router.navigateByUrl(
                    `/dashboard/blood-bank-onboarding/${facilityId}/${facilityTypeId}/blood-bank-add-bank?error=true`
                  );
                }
                return;
              }
              const address: any = response.address;
              if (address.address == null) {
                if (this.facilityType === this.FacilityType.Pharmacy) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/pharm-add-address?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.Hospital) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/hospital-add-address?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.Laboratory) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/laboratory-add-address?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.Radiology) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/radiology-add-address?error=true`
                  );
                } else if (this.facilityType === this.FacilityType.BloodBank) {
                  this.router.navigateByUrl(
                    `/dashboard/blood-bank-onboarding/${facilityId}/${facilityTypeId}/blood-bank-add-address?error=true`
                  );
                }
                return;
              }
              if (response?.patientType?.length == 0) {
                if (this.facilityType === this.FacilityType.Hospital) {
                  this.router.navigateByUrl(
                    `/dashboard/${smallFacilityType}-onboarding/${facilityId}/${facilityTypeId}/hospital-add-patient-card-type?error=true`
                  );
                }
                return;
              }
            });
            this.facilityTypeService.facilityType$
              .pipe(takeUntil(this.destroy$))
              .subscribe((type: any) => {
                this.facilityType = type;
              });
            if (!this.facilityTypeService.getFacilityType()) {
              this.api
                .getFacilityTypesOfFacility({ facilityId } as any)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: any) => {
                  const type = res?.[0]?.facilityType ?? null;
                  this.facilityTypeService.setFacilityType(type);
                });
            }
            this.facilityTypeService.refresh();
          }
        }, 1000);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
