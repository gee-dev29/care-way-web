import { inject, Injectable } from '@angular/core';
import { v4 } from 'uuid';
import moment from 'moment';
import { Router } from '@angular/router';
import { ToastService } from '@care-way/shared';
import Paystack from '@paystack/inline-js';
import { CalendarReminder, OrderType } from '@care-way/ui';
declare const PaystackPop: any;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private router = inject(Router);
  private alert = inject(ToastService);
  private calenderReminderService = inject(CalendarReminder);

  proceedToPayment(
    ServiceRequestOrder: any,
    orderId: any,
    member: any,
    api: any,
    payer: any,
    route: any,
    appointmentId?: string
  ) {
    const payId = v4();
    const paymentCode = moment().unix();

    api
      .registerOrderPaymentRequest({
        paymentId: payId,
        body: {
          orderId: orderId,
          email: member.email,
          payer: payer,
          orderType: ServiceRequestOrder as any,
          paymentMethod: 'Paystack' as any,
        },
      })
      .subscribe(() => {
        api
          .getOrderPaymentRequest$Response({ paymentId: payId })
          .subscribe((response: any) => {
            this.payWithPaystack(
              response,
              payId,
              api,
              route,
              member,
              ServiceRequestOrder,
              appointmentId
            );
          });
      });
  }

  payWithPaystack(
    paystackResponse: any,
    payId: string,
    api: any,
    route: string,
    member: any,
    orderType: string,
    appointmentId?: string
  ) {
    const paystack = new Paystack();
    paystack.checkout({
      key: paystackResponse.headers.get('x-payment-public-key'),
      email: member.email,
      amount: paystackResponse.body.amountInKobo,
      reference: payId,
      currency: paystackResponse.headers.get('x-currency_code'),
      metadata: {} as any,
      onSuccess: () => {
        api
          .processPaymentCallback({
            paymentId: payId,
            paymentMethod: 'Paystack',
          })
          .subscribe(() => {
            this.alert.show('Payment made successfully', 'success');
            if (orderType === OrderType.AppointmentOrder && appointmentId) {
              api
                .getMedicalAppointment({
                  appointmentId,
                })
                .subscribe((appointment: any) => {
                  this.setAppointmentReminder(appointment);
                });
            }
            if (orderType === OrderType.HmoProductOrder) {
              this.router.navigateByUrl(route);
              return;
            }
            setTimeout(() => {
              this.router.navigateByUrl('dashboard/orders');
            }, 300);
          });
      },
      onCancel: () => {
        this.alert.show('Payment cancelled', 'error');
      },
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
}
