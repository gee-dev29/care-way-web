import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, OrderType } from '@healbridge/api';
import { DocumentStatus } from '@healbridge/shared';
import {
  ButtonComponent,
  ToastService,
  ConfirmationModal,
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
import { filter, Observable, tap } from 'rxjs';
import { PaymentService } from '../payment-service';

@Component({
  selector: 'app-help-page-detail',
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
  templateUrl: './help-page-detail.html',
  styleUrl: './help-page-detail.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelpPageDetail implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public proceedToPayment = inject(PaymentService);
  private alert = inject(ToastService);
  public api = inject(ApiService);
  prescriptions$: Observable<any>;
  memberId: string;
  helpId: string;
  member: any;
  orderId: string;
  declineModal = false;
  orderItemId: string;
  serviceRequest: any;
  DocumentStatus = DocumentStatus;
  amount = 0;
  type: any;
  user = null;
  orderType = OrderType;
  payments: any = [];

  ngOnInit(): void {
    this.reload();
  }
  reload() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.orderId = params.orderId;
      this.helpId = params.helpId;
      if (params.user) {
        FileSystemHandle;
        this.user = params.user;
      }
      this.api
        .getOrderPaymentHelpRequests({ skip: 0, limit: 10000 })
        .subscribe((response: any) => {
          response.data.filter((each: any) => {
            if (
              each.orderId == params.orderId &&
              each.helpId == params.helpId
            ) {
              switch (each.orderType) {
                case 'Service Request Order':
                  this.type = this.orderType.ServiceRequestOrder;
                  this.prescriptions$ = this.api
                    .getServiceRequestOrder({
                      orderId: this.orderId,
                    })
                    .pipe(
                      tap((response: any) => {
                        this.amount =
                          response?.costSummary?.serviceCharge +
                          response?.costSummary?.serviceCharge +
                          response?.costSummary?.totalCost;
                        this.api
                          .getMember({ memberId: response.memberId })
                          .subscribe((member: any) => {
                            this.member = member;
                          });
                      })
                    );
                  break;
                default:
                  this.type = this.orderType.AppointmentOrder;
                  this.prescriptions$ = this.api
                    .getAppointmentOrder({
                      orderId: this.orderId,
                    })
                    .pipe(
                      tap((response: any) => {
                        this.amount =
                          response?.costSummary?.serviceCharge +
                          response?.costSummary?.serviceCharge +
                          response?.costSummary?.totalCost;
                        this.api
                          .getMember({ memberId: response.memberId })
                          .subscribe((member: any) => {
                            this.member = member;
                          });
                      })
                    );
                  break;
              }
            }
          });
        });
    });
    this.api
      .getPaymentsByOrderId({ orderId: this.orderId })
      .subscribe((response: any) => {
        this.payments = response;
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
    if (this.user !== null) {
      this.router.navigate(['dashboard/help-requests']);
    } else {
      this.router.navigate(['help-page', this.helpId, this.orderId]);
    }
  }

  declineHelp() {
    this.declineModal = true;
  }

  closeModal() {
    this.declineModal = false;
  }

  confirmIt() {
    this.api
      .updateHelpRequestStatus({
        helpId: this.helpId,
        body: { status: DocumentStatus.Declined },
      })
      .subscribe(() => {
        this.declineModal = false;
        this.alert.show('Help request declined successfully', 'success');
        setTimeout(() => {
          if (this.user) {
            this.router.navigate(['dashboard/help-requests']);
          } else {
            this.router.navigateByUrl(`login`);
          }
        }, 100);
      });
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

  continue() {
    this.proceedToPayment.proceedToPayment(
      this.type,
      this.orderId,
      this.member,
      this.api,
      'Friend',
      'login'
    );
  }
}
