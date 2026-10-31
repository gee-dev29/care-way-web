import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { AuthService, environment } from '@healbridge/shared';
import { AddAddress } from '@healbridge/ui';

import { IonContent } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'medical-facility-new-address',
  imports: [IonContent, AddAddress],
  templateUrl: './new-address.html',
  styleUrl: './new-address.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewAddress implements OnInit {
  private auth = inject(AuthService);
  public api = inject(ApiService);
  public router = inject(Router);
  public FacilityType = FacilityType;
  public activatedRoute = inject(ActivatedRoute);
  memberId: string;
  serviceRequestId: string;
  addressId: string;
  facilityId: string;
  facilityTypeId: string;
  facilityType: string;
  referencedDocumentId: any;
  onCancelRoute: string;
  apiKey = environment.mapKey;
  request: string;
  whoGoes: any;
  appointmentId: any;
  ionViewWillEnter(): void {
    this.load();
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.serviceRequestId = params.serviceRequestId;
      this.memberId = params.memberId;
      this.facilityType = params.facilityType;
      this.facilityId = params?.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      this.request = params.request;
      if (params.professionalSendCost) {
        this.whoGoes = params.whoGoes;
        this.appointmentId = params.appointmentId;
        switch (this.whoGoes) {
          case 'Patient':
            if (
              params.professionalId &&
              this.router.url.includes('doctor-dashboard')
            ) {
              this.onCancelRoute = `doctor-dashboard/${params.professionalId}/select-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${params.facilityTypeId}/select-address/${params.professionalId}/${this.whoGoes}/${params.professionalSendCost}/${this.appointmentId}`;
            } else {
              this.onCancelRoute = `dashboard/select-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${params.facilityTypeId}/select-address/${this.whoGoes}/${params.professionalSendCost}/${this.appointmentId}`;
            }
            this.referencedDocumentId = params.referenceDocumentId;
            break;
          default:
            if (
              params.professionalId &&
              this.router.url.includes('doctor-dashboard')
            ) {
              this.onCancelRoute = `doctor-dashboard/${params.professionalId}/select-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${params.facilityTypeId}/select-address/${params.professionalId}/${this.whoGoes}/${params.professionalSendCost}/${this.appointmentId}`;
            } else {
              this.onCancelRoute = `dashboard/select-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${params.facilityTypeId}/select-address/${this.whoGoes}/${params.professionalSendCost}/${this.appointmentId}`;
            }
            this.referencedDocumentId = params.facilityTypeId;
            break;
        }
      } else {
        this.referencedDocumentId = params.facilityId;
        this.onCancelRoute = `dashboard/select-address/${this.facilityType}/${this.facilityId}/${this.serviceRequestId}/${this.memberId}/${this.facilityTypeId}/select-address`;
      }
    });
  }
}
