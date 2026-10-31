import { Component, inject } from '@angular/core';
import { ApiService } from '@care-way/api';
import { AuthService } from '@care-way/shared';
import { PaymentSummary } from '@care-way/ui';
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
