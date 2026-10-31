import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { environment } from '@healbridge/shared';
import { SharedAddAddress } from '@healbridge/ui';

@Component({
  selector: 'medical-facility-pharm-add-address',
  imports: [SharedAddAddress],
  templateUrl: './pharm-add-address.html',
  styleUrl: './pharm-add-address.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PharmAddAddress implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public api = inject(ApiService);
  facilityId: string;
  pharmacyId: string;
  route: string;
  patch = false;
  backRoute: string;
  apiKey = environment.mapKey;

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.facilityId = params.facilityId;
      this.pharmacyId = params.pharmacyId;
      if (params.edit) {
        this.route = `/dashboard/pharm-profile/${this.facilityId}/${this.pharmacyId}`;
        this.backRoute = this.route;
      } else {
        this.route = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-empty-address`;
        this.backRoute = this.route;
      }
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.patch) {
        this.patch = true;
        this.route = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-empty-address/patch`;
        this.backRoute = `/dashboard/pharmacy-onboarding/${this.facilityId}/${this.pharmacyId}/pharm-empty-address/patch`;
      }
    });
  }
}
