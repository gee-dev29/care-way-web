import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@healbridge/api';
import { AuthService, FacilityType, DocumentStatus } from '@healbridge/shared';
import { Address, ConfirmationModal } from '@healbridge/ui';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, arrowForward, location } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-address-customer',
  imports: [
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonSkeletonText,
    CommonModule,
    ConfirmationModal,
  ],
  templateUrl: './select-address-customer.html',
  styleUrl: './select-address-customer.css',
})
export class SelectAddressCustomer implements OnInit, AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  public addressService = inject(Address);
  public auth = inject(AuthService);
  bg: any;
  FacilityType = FacilityType;
  costFlow: string;
  memberId: string;
  serviceRequestId: string;
  confirmSend = false;
  addressId: string;
  facilityId: string;
  facilityTypeId: string;
  facilityType: string;
  referralType: any;
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postCode: string;
  googlePlaceId: string;
  myAddress$: Observable<any>;
  facilityAddressIds: any = [];
  addressSelected: any;
  professionalSendCost: any;
  professionalId: any;
  whoGoes: any;
  referenceDocumentId: any;
  appointmentId: any;
  loaded = false;
  constructor() {
    addIcons({ location, addCircleOutline, arrowForward });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.serviceRequestId = params.serviceRequestId;
      this.memberId = params.memberId;
      this.facilityType = params.facilityType;
      this.facilityId = params?.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      // if (this.facilityType) {
      //   this.api
      //     .getFacilityTypeAddresses({
      //       facilityType: this.facilityType,
      //       facilityTypeId: this.facilityTypeId,
      //     } as any)
      //     .subscribe((response: any) => {
      //       response.forEach((address: any, index: any) => {
      //         this.facilityAddressIds.push(address.addressId);
      //       });
      //     });
      // }

      this.professionalSendCost = params.professionalSendCost;
      this.whoGoes = params.whoGoes;
      this.appointmentId = params.appointmentId;
      switch (this.whoGoes) {
        case 'Patient':
          this.api
            .getMember({ memberId: params.memberId })
            .subscribe((response: any) => {
              this.referenceDocumentId = response.referencedDocumentId;
              this.myAddress$ = this.api.getAddresses({
                referencedDocumentId: response.referencedDocumentId,
              } as any);
            });
          break;
        case 'Hospital':
          this.referenceDocumentId = params.facilityTypeId;
          this.myAddress$ = this.api.getAddresses({
            referencedDocumentId: params.facilityTypeId,
          } as any);
          break;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  }

  addAddress() {
    switch (this.whoGoes) {
      case 'Patient':
        this.router.navigateByUrl(
          `add-address/${this.serviceRequestId}/${this.memberId}/new-address/${this.whoGoes}/${this.professionalSendCost}/${this.referenceDocumentId}/${this.appointmentId}`
        );
        break;
      default:
        this.router.navigateByUrl(
          `add-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${this.facilityTypeId}/new-address/${this.whoGoes}/${this.professionalSendCost}/${this.referenceDocumentId}/${this.appointmentId}`
        );

        break;
    }
  }
  continue(addressSelected: any) {
    this.addressSelected = addressSelected;
    if (this.professionalSendCost) {
      this.confirmSend = false;
      this.sendCost();
    } else {
      this.confirmSend = true;
    }
  }
  sendCost() {
    this.api
      .addServiceRequestAddress({
        serviceRequestId: this.serviceRequestId,
        body: this.addressSelected,
      })
      .subscribe(() => {
        this.router.navigate(
          ['/dashboard/view-appointment/', this.appointmentId],
          {
            queryParams: { module: 'Customer' },
          }
        );
      });
  }
}
