import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType } from '@healbridge/api';
import { AuthService, DocumentStatus } from '@healbridge/shared';
import { Address, ConfirmationModal } from '@healbridge/ui';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, arrowForward, body, location } from 'ionicons/icons';
import { Observable } from 'rxjs';
@Component({
  selector: 'medical-facility-select-address',
  imports: [
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonSkeletonText,
    CommonModule,
    ConfirmationModal,
  ],
  templateUrl: './select-address.html',
  styleUrl: './select-address.css',
})
export class SelectAddress implements OnInit, AfterViewInit {
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
      // this.api
      //   .getFacilityTypeAddresses({
      //     facilityType: this.facilityType,
      //     facilityTypeId: this.facilityTypeId,
      //   } as any)
      //   .subscribe((response: any) => {
      //     response.forEach((address: any, index: any) => {
      //       this.facilityAddressIds.push(address.addressId);
      //     });
      //   });
      if (params.professionalId) {
        this.professionalId = params.professionalId;
      }
      if (params.professionalSendCost) {
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
          default:
            this.referenceDocumentId = params.facilityTypeId;
            this.myAddress$ = this.api.getAddresses({
              referencedDocumentId: params.facilityTypeId,
            } as any);
            break;
        }
      } else {
        this.myAddress$ = this.api.getAddresses({
          referencedDocumentId: params.facilityId,
        } as any);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  }

  addAddress() {
    if (this.professionalSendCost != null) {
      switch (this.whoGoes) {
        case 'Patient':
          if (this.professionalSendCost) {
            this.router.navigateByUrl(
              `doctor-dashboard/${this.professionalId}/add-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${this.facilityTypeId}/new-address/${this.whoGoes}/${this.professionalSendCost}/${this.referenceDocumentId}/${this.appointmentId}`
            );
          } else {
            this.router.navigateByUrl(
              `add-address/${this.facilityType}/${this.serviceRequestId}/${this.memberId}/${this.facilityTypeId}/new-address/${this.whoGoes}/${this.professionalSendCost}/${this.referenceDocumentId}/${this.appointmentId}`
            );
          }
          break;
        default:
          break;
      }
    } else {
      this.router.navigateByUrl(
        `add-address/${this.facilityType}/${this.facilityId}/${this.serviceRequestId}/${this.memberId}/${this.facilityTypeId}/new-address`
      );
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
    if (this.professionalSendCost) {
      this.api
        .addServiceRequestAddress({
          serviceRequestId: this.serviceRequestId,
          body: this.addressSelected,
        })
        .subscribe(() => {
          switch (this.whoGoes) {
            case 'Patient':
              if (
                this.professionalId &&
                this.router.url.includes('doctor-dashboard')
              ) {
                this.router.navigateByUrl(
                  `doctor-dashboard/${this.professionalId}/view-appointment/${this.appointmentId}/${this.memberId}`
                );
              } else {
                this.router.navigate([
                  '/dashboard/view-appointment/',
                  this.facilityType,
                  this.facilityId,
                  this.facilityTypeId,
                  this.appointmentId,
                  this.memberId,
                ]);
              }
              break;
            default:
              if (
                this.professionalId &&
                this.router.url.includes('doctor-dashboard')
              ) {
                this.router.navigateByUrl(
                  `doctor-dashboard/${this.professionalId}/view-appointment/${this.appointmentId}/${this.memberId}`
                );
              } else {
                this.router.navigate([
                  '/dashboard/view-appointment/',
                  this.facilityType,
                  this.facilityId,
                  this.facilityTypeId,
                  this.appointmentId,
                  this.memberId,
                ]);
              }
              break;
          }
        });
    } else {
      this.api
        .setServiceRequestFacilityTypeAddress({
          serviceRequestId: this.serviceRequestId,
          facilityTypeId: this.facilityTypeId,
          body: this.addressSelected as any,
        })
        .subscribe(() => {
          this.facilityAddressIds.push(this.addressSelected.addressId);
          this.api
            .addFacilityTypeAddress({
              facilityType: this.facilityType,
              facilityTypeId: this.facilityTypeId,
              body: this.facilityAddressIds,
            } as any)
            .subscribe(() => {
              this.confirmSend = false;
              setTimeout(() => {
                this.api
                  .updateServiceRequestFacilityStatus({
                    serviceRequestId: this.serviceRequestId,
                    facilityTypeId: this.facilityTypeId,
                    body: { status: DocumentStatus.Processed },
                  })
                  .subscribe(() => {
                    this.router.navigateByUrl('dashboard/request');
                  });
              }, 100);
            });
        });
    }
  }

  reuse(facilityType: any) {
    switch (facilityType) {
      case this.FacilityType.BloodBank:
        this.bg = '#FFFFFF';
        break;
      case this.FacilityType.Radiology:
        this.bg = '#FFFFFF';
        break;
      case this.FacilityType.Laboratory:
        this.bg = '#FFFFFF';
        break;
      case this.FacilityType.Pharmacy:
        this.bg = '#F9F8F6';
        break;
    }
  }
}
