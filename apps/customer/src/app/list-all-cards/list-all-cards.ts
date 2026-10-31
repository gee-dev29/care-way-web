import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, trashBinOutline } from 'ionicons/icons';
import {
  ConfirmationModal,
  ButtonComponent,
  ToastService,
  OrderType,
  CalendarReminder,
} from '@care-way/ui';
import { PaymentService } from '../payment-service';
import { ApiService } from '@care-way/api';
import { v4 } from 'uuid';
import moment from 'moment-timezone';
import { HmoJourneyService } from '@care-way/shared';
@Component({
  selector: 'app-list-all-cards',
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    ConfirmationModal,
    ButtonComponent,
  ],
  templateUrl: './list-all-cards.html',
  styleUrl: './list-all-cards.css',
})
export class ListAllCards implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);
  private alert = inject(ToastService);
  private calenderReminderService = inject(CalendarReminder);
  private hmoJourney = inject(HmoJourneyService);
  prompt = false;
  proceedToPayment = inject(PaymentService);
  orderType: any;
  orderId: any;
  costSummary: any;
  promptUsingCard = false;
  cardInfo: any;
  email: any;
  firstName: any;
  loading = false;
  lastName: any;
  authorizationId: any;
  routeLink: any;
  cards: any = [];
  removeSome = false;
  gradientClasses = ['grad-green', 'grad-cream', 'grad-gray'];
  appointmentId: string;

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.orderType = params.orderType;
      this.orderId = params.orderId;
      this.appointmentId = params.appointmentId;
      this.email = params.email;
      this.firstName = params.email;
      this.lastName = params.lastName;
      this.routeLink = params.route;
      if (params.removeSome) {
        this.removeSome = true;
      }
      if (this.orderId) {
        if (params.orderType === OrderType.ServiceRequestOrder) {
          this.api
            .getServiceRequestOrder({
              orderId: this.orderId,
            })
            .subscribe((response: any) => {
              this.costSummary = response.costSummary;
            });
        }
        if (params.orderType === OrderType.HmoProductOrder) {
          const price = this.hmoJourney.getPurchase(this.orderId)?.hmoProduct
            ?.price;
          if (price !== undefined) {
            this.costSummary = { totalCost: price };
          }
        }
        if (params.orderType === OrderType.AppointmentOrder) {
          this.api
            .getAppointmentOrder({
              orderId: this.orderId,
            })
            .subscribe((response: any) => {
              this.costSummary = response?.costSummary;
            });
        }
      }
      this.getPaymentAuthorizations();
    });
  }

  getPaymentAuthorizations() {
    this.api.getPaymentAuthorizations({} as any).subscribe((response: any) => {
      this.cards = response;
    });
  }

  constructor() {
    addIcons({
      chevronBackOutline,
      trashBinOutline,
    });
  }

  getCardClass(index: number): string {
    const colors = ['card-0', 'card-1', 'card-2'];
    return colors[index % colors.length];
  }

  goBack() {
    if (this.removeSome) {
      if (this.orderType === OrderType.AppointmentOrder) {
        this.router.navigate(['dashboard/payment-summary', this.appointmentId]);
      }
      if (this.orderType === OrderType.ServiceRequestOrder) {
        this.router.navigate(['dashboard/order-details', this.orderId]);
      }
      if (this.orderType === OrderType.HmoProductOrder) {
        this.router.navigate(['dashboard/hmo-plan', this.orderId]);
      }
    } else {
      this.router.navigateByUrl('dashboard/more');
    }
  }

  deleteCard(card: any) {
    this.prompt = true;
    this.authorizationId = card.id;
  }

  closeConfirmationModal() {
    this.prompt = false;
  }

  deleteIt() {
    this.loading = true;
    const payload: any = {
      authorizationId: this.authorizationId,
    };
    this.api.deletePaymentAuthorization({ body: payload } as any).subscribe({
      next: () => {
        this.prompt = false;
        this.getPaymentAuthorizations();
        this.alert.show('Card removed successfully', 'success');
        this.load();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.prompt = false;
      },
    });
  }

  route() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.proceedToPayment.proceedToPayment(
        this.orderType,
        this.orderId,
        { firstName: this.firstName, email: this.email },
        this.api,
        `${this.firstName} ${this.lastName}`,
        `/dashboard/${this.routeLink}`,
        this.appointmentId
      );
    }, 1000);
  }

  confirmPayment(card: any) {
    if (this.orderId) {
      this.cardInfo = card;
      this.promptUsingCard = true;
    }
  }

  payIt() {
    this.loading = true;
    const payId = v4();
    this.api
      .registerOrderPaymentRequest({
        paymentId: payId,
        body: {
          orderId: this.orderId,
          email: this.email,
          payer: `${this.firstName} ${this.lastName}`,
          orderType: this.orderType as any,
          paymentMethod: 'Paystack' as any,
        },
      })
      .subscribe(() => {
        this.api
          .processPaymentWithAuthorization({
            authorizationId: this.cardInfo.id,
            paymentId: payId,
            body: {
              paymentMethod: 'Paystack' as any,
            },
          } as any)
          .subscribe({
            next: () => {
              this.loading = false;
              this.promptUsingCard = false;
              this.alert.show('Payment made successfully', 'success');
              if (
                this.orderType === OrderType.AppointmentOrder &&
                this.appointmentId
              ) {
                this.api
                  .getMedicalAppointment({
                    appointmentId: this.appointmentId,
                  })
                  .subscribe((appointment: any) => {
                    this.setAppointmentReminder(appointment);
                  });
              }
              if (this.orderType === OrderType.HmoProductOrder) {
                this.router.navigateByUrl(`dashboard/${this.routeLink}`);
                return;
              }
              setTimeout(() => {
                this.router.navigateByUrl('dashboard/orders');
              }, 300);
            },
            error: () => {
              this.loading = false;
            },
          });
      });
  }

  setAppointmentReminder(appointment: any) {
    const localDateTime = moment
      .utc(`${appointment.date} ${appointment.time}`, 'YYYY-MM-DD HH:mm')
      .local();
    this.calenderReminderService.downloadIcs({
      title: 'Appointment',
      description: `Care-Way Appointment with Doctor ${
        appointment.professional?.firstName +
        ' ' +
        appointment.professional?.lastName
      } on ${localDateTime.format(
        'ddd MMMM D, YYYY'
      )} at ${localDateTime.format('h:mm A')}`,
      date: localDateTime.format('YYYY-MM-DD'),
      time: localDateTime.format('HH:mm'),
      durationMinutes: 30,
      reminderMinutesBefore: [1440, 60, 10],
    });
  }

  closePayModal() {
    this.promptUsingCard = false;
  }
}
