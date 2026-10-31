import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@care-way/api';
import { AuthService, FacilityType, environment } from '@care-way/shared';
import { AddAddress } from '@care-way/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-new-address-customer',
  imports: [IonContent, AddAddress],
  templateUrl: './new-address-customer.html',
  styleUrl: './new-address-customer.css',
})
export class NewAddressCustomer implements OnInit {
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

      this.whoGoes = params.whoGoes;
      this.appointmentId = params.appointmentId;
      switch (this.whoGoes) {
        case 'Patient':
          this.onCancelRoute = `dashboard/select-address/${this.serviceRequestId}/${this.memberId}/select-address/${this.whoGoes}/${params.professionalSendCost}/${this.appointmentId}`;

          this.referencedDocumentId = params.referenceDocumentId;
          break;
        default:
          this.onCancelRoute = `dashboard/select-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${params.facilityTypeId}/select-address/${this.whoGoes}/${params.professionalSendCost}/${this.appointmentId}`;

          this.referencedDocumentId = params.facilityTypeId;
          break;
      }
    });
  }
}
