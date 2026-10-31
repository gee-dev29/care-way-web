import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonHeader,
  IonSkeletonText,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, receiptOutline } from 'ionicons/icons';
import { ButtonComponent } from '../button/button.component';
import { Observable, shareReplay, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppointmentCardType } from '../appointment-card-type/appointment-card-type';
import { v4 } from 'uuid';
import { AppointmentType, OrderType } from '../models/action.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ui-payment-summary',
  imports: [
    IonContent,
    IonHeader,
    IonIcon,
    IonText,
    ButtonComponent,
    CommonModule,
    IonSkeletonText,
    AppointmentCardType,
  ],
  templateUrl: './payment-summary.html',
  styleUrl: './payment-summary.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentSummary implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  @Input() api: any;
  @Input() auth: any;
  module: string | null = null;
  appointmentId: string;
  appointment$: Observable<any>;
  professionalFees: any = [];
  cardType = 'individual';
  totalAppointmentFee: number;
  appointment: any;
  membershipCardTypes$: Observable<any>;
  showPaymentSummary: boolean;
  appointmentOrder$: Observable<any>;
  appointmentType: string;
  type = AppointmentType;
  orderId: string;
  email: string;
  @Input() paymentService: any;
  showCardTypeOptions = true;
  facilityTypeId: string;
  selectedCardId: string;
  destroyRef = inject(DestroyRef);
  canPay = false;
  loading: boolean;

  constructor() {
    addIcons({
      documentTextOutline,
      receiptOutline,
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.module = params.module;
      this.appointmentId = params.appointmentId;
      this.getMedicalAppointment();
    });
  }

  getMedicalAppointment() {
    this.appointment$ = this.api
      .getMedicalAppointment({
        appointmentId: this.appointmentId,
      })
      .pipe(
        take(1),
        tap((appointment: any) => {
          this.appointment = appointment;
          this.appointmentType = appointment.appointmentType;
          this.facilityTypeId = appointment.facilityTypeId;
          this.checkAndGetAppointmentOrder();
        }),
        shareReplay(1)
      );
  }

  checkAndGetAppointmentOrder(membershipCardType?: any) {
    this.api
      .getAppointmentOrders({ appointmentId: this.appointmentId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders: any) => {
        if (orders.data.length >= 1) {
          const orderId = orders.data[0]?.orderId;
          this.orderId = orders.data[0]?.orderId;
          this.getOrderPayments(orderId);
          if (!this.selectedCardId) {
            this.selectedCardId = orders.data[0]?.membershipCardTypeId;
          }
          if (this.appointmentType === AppointmentType.Physical) {
            this.getMembershipCardTypes();
            if (orders.data[0]?.cardId === membershipCardType?.cardId) {
              this.getAppointmentOrder(orderId);
            } else {
              this.createAppointmentOrder(
                orderId,
                membershipCardType?.cardId ?? null
              );
            }
          }
          if (this.appointmentType === AppointmentType.Virtual) {
            this.getAppointmentOrder(orderId);
          }
        } else {
          if (this.appointmentType === AppointmentType.Physical) {
            this.getMembershipCardTypes(membershipCardType);
          }
          if (this.appointmentType === AppointmentType.Virtual) {
            const orderId = v4();
            this.orderId = orderId;
            this.createAppointmentOrder(orderId);
          }
        }
      });
  }

  createAppointmentOrder(orderId: string, membershipCardTypeId?: any) {
    this.api
      .createAppointmentOrder({
        orderId,
        body: {
          appointmentId: this.appointmentId,
          membershipCardTypeId: membershipCardTypeId ?? null,
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.orderId = orderId;
        this.canPay = true;
        this.getAppointmentOrder(orderId);
        this.getOrderPayments(orderId);
      });
  }

  getMembershipCardTypes(membershipCardType?: any) {
    this.membershipCardTypes$ = this.api
      .getFacilityTypeMembershipCardTypes({
        facilityTypeId: this.facilityTypeId,
      })
      .pipe(
        tap((response: any) => {
          const orderId = v4();
          if (response.length === 0) {
            this.showCardTypeOptions = false;
            this.createAppointmentOrder(orderId);
          } else {
            if (membershipCardType) {
              this.createAppointmentOrder(orderId, membershipCardType?.cardId);
            }
          }
        })
      );
  }

  getCardType(membershipCardType?: any) {
    this.selectedCardId = membershipCardType?.cardId;
    this.checkAndGetAppointmentOrder(membershipCardType);
  }

  getAppointmentOrder(orderId: string) {
    this.appointmentOrder$ = this.api.getAppointmentOrder({
      orderId,
    });
    this.showPaymentSummary = true;
  }

  getOrderPayments(orderId: string) {
    this.api
      .getPaymentsByOrderId({ orderId })
      .subscribe((orderPayments: any[]) => {
        this.canPay = !orderPayments?.some(
          (payment) => payment.status === true
        );
      });
  }

  navigateTo() {
    this.router.navigate(['dashboard/view-appointment', this.appointmentId], {
      queryParams: { module: 'Customer' },
    });
  }

  continue() {
    this.loading = true;
    this.auth.userDetail(this.api, (auth: any) => {
      this.api.getUser({ userId: auth?.jti }).subscribe({
        next: (user: any) => {
          this.routeToCard(user);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    });
  }

  sharePaymentLink() {
    this.router.navigateByUrl(
      `/dashboard/share-order-payment-link/${this.appointmentId}/${this.orderId}`
    );
  }

  routeToCard(user: any) {
    this.api.getPaymentAuthorizations({} as any).subscribe((response: any) => {
      if (response.length) {
        this.router.navigateByUrl(
          `dashboard/list-all-cards/${OrderType.AppointmentOrder}/${this.orderId}/${this.appointmentId}/${user.email}/${user?.firstName}/${user?.lastName}/removeSome/appointments`
        );
      } else {
        this.paymentService.proceedToPayment(
          OrderType.AppointmentOrder,
          this.orderId,
          user,
          this.api,
          `${user?.firstName} ${user?.lastName}`,
          `/dashboard/appointments`
        );
      }
    });
  }
}
