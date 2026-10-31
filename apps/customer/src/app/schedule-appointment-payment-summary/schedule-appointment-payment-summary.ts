import { Component, inject } from '@angular/core';
import { ApiService } from '@healbridge/api';
import { AuthService } from '@healbridge/shared';
import { PaymentSummary } from '@healbridge/ui';
import { PaymentService } from '../payment-service';

@Component({
  selector: 'app-schedule-appointment-payment-summary',
  imports: [PaymentSummary],
  templateUrl: './schedule-appointment-payment-summary.html',
  styleUrl: './schedule-appointment-payment-summary.css',
})
export class ScheduleAppointmentPaymentSummary {
  public api = inject(ApiService);
  public auth = inject(AuthService);
  public paymentService = inject(PaymentService);
  
}
