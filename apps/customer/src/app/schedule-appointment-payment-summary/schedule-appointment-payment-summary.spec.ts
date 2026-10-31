import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAppointmentPaymentSummary } from './schedule-appointment-payment-summary';

describe('ScheduleAppointmentPaymentSummary', () => {
  let component: ScheduleAppointmentPaymentSummary;
  let fixture: ComponentFixture<ScheduleAppointmentPaymentSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleAppointmentPaymentSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAppointmentPaymentSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
