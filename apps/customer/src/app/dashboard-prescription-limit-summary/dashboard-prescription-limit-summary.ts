import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType, OrderType } from '@care-way/api';
import { AuthService, CostFlow, DocumentStatus } from '@care-way/shared';
import {
  ButtonComponent,
  ConfirmationModal,
  StorageService,
  ToastService,
} from '@care-way/ui';
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonList,
  IonModal,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronDownOutline,
  chevronForwardOutline,
  chevronUpOutline,
  locationOutline,
  refreshCircleOutline,
  returnUpForwardOutline,
  trashOutline,
} from 'ionicons/icons';
import { Observable, tap } from 'rxjs';
import { PaymentService } from '../payment-service';

@Component({
  selector: 'app-dashboard-prescription-limit-summary',
  imports: [
    IonIcon,
    IonContent,
    IonIcon,
    IonText,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    ButtonComponent,
    IonList,
    IonIcon,
    CommonModule,
    ConfirmationModal,
  ],
  templateUrl: './dashboard-prescription-limit-summary.html',
  styleUrl: './dashboard-prescription-limit-summary.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardPrescriptionLimitSummary implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private alert = inject(ToastService);
  private auth = inject(AuthService);
  api = inject(ApiService);
  total: number;
  prescriptions$: Observable<any>;
  allAddresses: any;
  address: any;
  limit: any;
  selectedAddressId: string | null = null;
  medicalType: string;
  facilityId: string;
  proceedToPayment = inject(PaymentService);
  facilityTypeId: string;
  facilityType: string;
  serviceRequestId: string;
  storageService = inject(StorageService);
  memberId: string;
  orderId: string;
  expanded = false;
  deleteModal = false;
  deleteOrder = false;
  orderItemId: string;
  serviceRequest: any;
  DocumentStatus = DocumentStatus;
  member: any;
  orderType = OrderType;

  ngOnInit(): void {
    this.reload();
  }
  reload() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.serviceRequestId = params.serviceRequestId;
      this.medicalType = params['medical-type'];
      this.facilityType = params.facilityType;
      this.facilityId = params.facilityId;
      this.facilityTypeId = params.facilityTypeId;
      this.limit = params.limit;
      this.orderId = params.orderId;
      this.prescriptions$ = this.api
        .getServiceRequestOrder({
          orderId: this.orderId,
        })
        .pipe(
          tap((response: any) => {
            this.api
              .getServiceRequest({
                memberId: this.memberId,
                serviceRequestId: response.serviceRequestId,
                referralType: response.referralType as any,
              })
              .subscribe((response2: any) => {
                this.serviceRequest = response2;
                this.serviceRequestId = response.serviceRequestId;
                this.facilityType = response.referralType;
                this.facilityTypeId = response?.items[0]?.facilityTypeId;
                this.memberId = response.memberId;
                switch (this.facilityType) {
                  case FacilityType.Pharmacy:
                    this.medicalType = CostFlow.PHARMACY;
                    break;
                  case FacilityType.Laboratory:
                    this.medicalType = CostFlow.LABTEST;
                    break;
                  case FacilityType.Radiology:
                    this.medicalType = CostFlow.RADIOLOGY;
                    break;
                  case FacilityType.BloodBank:
                    this.medicalType = CostFlow.BLOODBANK;
                    break;
                  default:
                    return;
                }
              });
          })
        );
      if (this.limit) {
        this.memberId = params.memberId;
        this.api
          .getServiceRequest({
            memberId: this.memberId,
            serviceRequestId: this.serviceRequestId,
            referralType: this.facilityType as any,
          })
          .subscribe((response: any) => {
            this.serviceRequest = response;
          });
      } else {
        this.storageService.user$.subscribe((memberId: any) => {
          this.memberId = memberId;
        });
      }
      this.api
        .getMember({ memberId: this.memberId })
        .subscribe((member: any) => {
          this.member = member;
        });
    });
  }
  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'trash-outline': trashOutline,
      'location-outline': locationOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'refresh-circle-outline': refreshCircleOutline,
      'return-up-forward-outline': returnUpForwardOutline,
      'chevron-down-outline': chevronDownOutline,
      'chevron-up-outline': chevronUpOutline,
    });
  }

  goBack() {
    this.router.navigateByUrl('dashboard/orders');
  }


  name!: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }



  onChooseAddress(item: any) {
    this.selectedAddressId = item.addressId;
    this.address = item;
  }

  navigateTo() {
    this.router.navigateByUrl(
      `/dashboard/address/${this.facilityType}/${this.serviceRequest.serviceRequestId}/${this.orderId}`
    );
  }

  subTotal() {
    //
  }

  sharePaymentLink() {
    this.router.navigateByUrl(
      `/dashboard/share-order-payment-link/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${this.memberId}/${this.facilityTypeId}/${this.orderId}/${this.limit}`
    );
  }
  sharePaymentLinkTwo(serviceRequest: any) {
    this.api
      .getServiceRequestOrders({
        serviceRequestId: serviceRequest.serviceRequestId,
        memberId: this.memberId,
      })
      .subscribe((response: any) => {
        const filter = response.data.find(
          (data: any) =>
            data.serviceRequestCode === serviceRequest.serviceRequestCode &&
            data?.orderItems?.length
        );
        this.router.navigateByUrl(
          `/dashboard/share-order-payment-link/${
            serviceRequest.serviceRequestId
          }/${
            serviceRequest.referralType
          }/${serviceRequest.referralType.toLowerCase()}/${
            serviceRequest.memberId
          }/${filter.orderItems[0].facilityTypeId}/${
            serviceRequest.serviceRequestOrderId
          }/custom`
        );
      });
  }

  onTrash(orderItemId: any) {
    this.deleteModal = true;
    this.orderItemId = orderItemId;
  }

  closeModal() {
    this.deleteModal = false;
  }

  onReset() {
    this.deleteOrder = true;
  }

  closeReset() {
    this.deleteOrder = false;
  }

  confirmSwitch() {
    this.api
      .deleteServiceRequestOrderItem({
        orderId: this.orderId,
        orderItemId: this.orderItemId,
      })
      .subscribe(() => {
        this.deleteModal = false;
        this.alert.show('Item deleted successfully', 'success');
        this.reload();
      });
  }

  onToggle() {
    this.expanded = !this.expanded;
  }

  confirmDelete() {
    this.api
      .deleteServiceRequestOrder({
        orderId: this.orderId,
      })
      .subscribe(() => {
        this.deleteOrder = false;
        this.alert.show('Order deleted successfully', 'success');
        setTimeout(() => {
          this.router.navigateByUrl(
            `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${this.memberId}/${this.facilityTypeId}/pricing`
          );
        }, 100);
      });
  }

  routeToCard() {
    this.api.getPaymentAuthorizations({} as any).subscribe((response: any) => {
      if (response.length) {
        this.router.navigateByUrl(
          `dashboard/list-all-cards/${OrderType.ServiceRequestOrder}/${this.orderId}/${this.member.email}/${this.member?.firstName}/${this.member?.lastName}/removeSome/orders`
        );
      } else {
        this.proceedToPayment.proceedToPayment(
          OrderType.ServiceRequestOrder,
          this.orderId,
          this.member,
          this.api,
          `${this.member?.firstName} ${this.member?.lastName}`,
          `/dashboard/orders`
        );
      }
    });
  }
}
