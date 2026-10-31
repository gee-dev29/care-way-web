import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FacilityType, OrderType } from '@healbridge/api';
import { AuthService, CostFlow, DocumentStatus } from '@healbridge/shared';
import {
  ButtonComponent,
  ConfirmationModal,
  StorageService,
  ToastService,
} from '@healbridge/ui';
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
  attachOutline,
  chevronBackOutline,
  chevronDownOutline,
  chevronForwardOutline,
  chevronUpOutline,
  locationOutline,
  refreshCircleOutline,
  returnUpForwardOutline,
  trashOutline,
} from 'ionicons/icons';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { PaymentService } from '../payment-service';

@Component({
  selector: 'app-order-details',
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
    IonModal,
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderDetails implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private alert = inject(ToastService);
  private auth = inject(AuthService);
  api = inject(ApiService);
  total: number;
  order$: Observable<any>;
  allAddresses: any;
  address: any;
  selectedAddressId: string | null = null;
  medicalType: string;
  facilityId: string;
  proceedToPayment = inject(PaymentService);
  facilityTypeId: string;
  facilityType: string;
  FacilityType = FacilityType;
  serviceRequestId: string;
  storageService = inject(StorageService);
  memberId: string;
  orderId: string;
  expanded = false;
  deleteModal = false;
  deleteOrder = false;
  viewAttach = false;
  imageView: string;
  index = 0;
  uploads: any = [];
  orderItemId: string;
  whichIndex: any;
  serviceRequest: any;
  payments: any = [];
  DocumentStatus = DocumentStatus;
  member: any;
  orderHistory: any;
  orderType = OrderType;
  fulfilment: any;
  loading: boolean;
  loadingTwo: boolean;

  @ViewChild('scrollArea') scrollArea!: ElementRef<HTMLDivElement>;
  @ViewChild('previewImg') previewImg!: ElementRef<HTMLImageElement>;

  zoomLevel = 1;
  transformOrigin = 'center center';

  private minZoom = 1;
  private maxZoom = 4;
  private zoomStep = 0.2;

  private startDistance = 0;
  private startZoom = 1;

  canDismiss = true;
  @ViewChild('modal3') modal3: IonModal;

  isUploadClicked = false;

  ngOnInit(): void {
    this.reload();
  }
  reload() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.orderId = params.orderId;
      this.api
        .getPaymentsByOrderId({ orderId: this.orderId })
        .subscribe((response: any) => {
          this.payments = response;
        });
      this.order$ = this.api
        .getServiceRequestOrder({
          orderId: this.orderId,
        })
        .pipe(
          switchMap((order: any) => {
            this.orderHistory = order.statusHistory;
            this.serviceRequestId = order.serviceRequestId;
            this.facilityType = order.referralType;
            this.memberId = order.memberId;
            this.facilityTypeId = order?.items[0]?.facilityTypeId;

            const uploadRequests = order.items.map((each: any) =>
              this.api.getUploads({ referencedDocumentId: each.orderItemId })
            );

            return forkJoin(uploadRequests).pipe(
              switchMap((uploadedFiles: any) => {
                order.items = order.items.map((item: any, index: number) => ({
                  ...item,
                  uploads: uploadedFiles[index],
                }));

                this.fulfilment = order;

                return this.api.getServiceRequest({
                  memberId: this.memberId,
                  serviceRequestId: order.serviceRequestId,
                  referralType: order.referralType as any,
                });
              }),
              map((serviceReq: any) => {
                this.serviceRequest = serviceReq;
                return order;
              })
            );
          })
        );

      this.storageService.user$.subscribe((memberId: any) => {
        this.memberId = memberId;
      });

      this.api
        .getMember({ memberId: this.memberId })
        .subscribe((member: any) => {
          this.member = member;
        });
    });
    this.order$.subscribe((orders: any) => {
      // console.log(orders);
    })
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
      'attach-outline': attachOutline,
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

  navigateTo(order: any) {
    if (order.status === DocumentStatus.Pending) {
      this.router.navigateByUrl(
        `/dashboard/address/${this.facilityType}/${this.serviceRequest.serviceRequestId}/${this.orderId}`
      );
    }
  }

  subTotal() {
    //
  }

  sharePaymentLink() {
    this.router.navigateByUrl(
      `/dashboard/share-order-payment-link/${this.orderId}`
    );
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

  shouldIShowPayButton(): boolean {
    let booleanResult: any;
    const result = this.payments.filter(
      (response: any) => response.status === true
    );
    if (result.length) {
      booleanResult = false;
    } else {
      booleanResult = true;
    }
    return booleanResult;
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
            `/dashboard/${this.serviceRequestId}/${this.facilityType}/${this.medicalType}/${this.memberId}/pricing`
          );
        }, 100);
      });
  }

  routeToCard() {
    this.loading = true;
    this.api.getPaymentAuthorizations({} as any).subscribe((response: any) => {
      if (response.length) {
        this.loading = false;
        this.router.navigateByUrl(
          `dashboard/list-all-cards/${OrderType.ServiceRequestOrder}/${this.orderId}/${this.member.email}/${this.member?.firstName}/${this.member?.lastName}/removeSome/orders`
        );
      } else {
        this.loading = false;
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
  createDrugAdverse(item: any) {
    this.router.navigate([
      'dashboard',
      'create-drug-adverse',
      item.orderId,
      item.orderItemId,
    ]);
  }

  createDrugSchedule(item: any) {
    this.router.navigate([
      'dashboard',
      'create-reminder',
      item.orderId,
      item.orderItemId,
    ]);
  }

  getTimeLineData(status: any) {
    return this.orderHistory.find((response: any) => response.status == status);
  }

  showUploadedImage(index: any) {
    this.whichIndex = index;
    this.viewAttach = true;
    this.uploads = this.fulfilment?.items[this.whichIndex]?.uploads;
    this.imageView = this.uploads[this.index].url;
  }

  showUploadedAttachment(url: any) {
    this.imageView = url;
    this.viewAttach = true;
  }

  next() {
    if (this.index < this.uploads.length - 1) {
      this.index = this.index + 1;
      this.imageView = this.uploads[this.index].url;
    }
  }

  back() {
    if (this.index > 0) {
      this.index = this.index - 1;
      this.imageView = this.uploads[this.index].url;
    }
  }

  setPreview(url: string) {
    this.imageView = url;
    this.zoomLevel = 1;
    this.transformOrigin = 'center center';

    if (this.scrollArea?.nativeElement) {
      this.scrollArea.nativeElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  onWheelZoom(event: WheelEvent) {
    event.preventDefault();

    this.updateTransformOrigin(event.clientX, event.clientY);

    if (event.deltaY < 0) {
      this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
    } else {
      this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
    }
  }

  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      this.startDistance = this.getTouchDistance(event.touches);
      this.startZoom = this.zoomLevel;

      const center = this.getTouchCenter(event.touches);
      this.updateTransformOrigin(center.x, center.y);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      event.preventDefault();

      const currentDistance = this.getTouchDistance(event.touches);
      if (!this.startDistance) return;

      const center = this.getTouchCenter(event.touches);
      this.updateTransformOrigin(center.x, center.y);

      const scaleFactor = currentDistance / this.startDistance;
      const newZoom = this.startZoom * scaleFactor;

      this.zoomLevel = Math.min(Math.max(newZoom, this.minZoom), this.maxZoom);
    }
  }

  onTouchEnd(event: TouchEvent) {
    if (event.touches.length < 2) {
      this.startDistance = 0;
    }
  }

  private getTouchDistance(touches: TouchList): number {
    const touch1 = touches[0];
    const touch2 = touches[1];

    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private getTouchCenter(touches: TouchList) {
    const touch1 = touches[0];
    const touch2 = touches[1];

    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }

  private updateTransformOrigin(clientX: number, clientY: number) {
    if (!this.previewImg?.nativeElement) return;

    const rect = this.previewImg.nativeElement.getBoundingClientRect();

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    this.transformOrigin = `${x}% ${y}%`;
  }

  async closeSave() {
    this.viewAttach = false;
    this.canDismiss = true;
    await this.modal3.dismiss(null, 'close');
    this.canDismiss = false;
    this.isUploadClicked = false;
    this.index = 0;
  }
}
