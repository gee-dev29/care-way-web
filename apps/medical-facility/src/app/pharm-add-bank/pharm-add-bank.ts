import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedAddBank } from '@healbridge/ui';
import { ApiService, FacilityType } from '@healbridge/api';
@Component({
  selector: 'medical-facility-pharm-add-bank',
  imports: [CommonModule, SharedAddBank],
  templateUrl: './pharm-add-bank.html',
  styleUrl: './pharm-add-bank.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmAddBank implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  facilityType = FacilityType.Pharmacy;
  pharmacyId: string;
  route: string;
  backRoute: string;

  ngOnInit(): void {
    this.backRoute = history.state?.backRoute;
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      if (params.edit) {
        this.route = `/dashboard/pharm-profile/${this.facilityId}/${this.pharmacyId}`;
      } else {
        this.route = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-empty-bank`;
      }
      if (this.backRoute) {
        this.route = this.backRoute;
      }
    });
  }
}
