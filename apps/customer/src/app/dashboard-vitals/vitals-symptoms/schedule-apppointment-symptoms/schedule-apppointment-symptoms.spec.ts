import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleApppointmentSymptoms } from './schedule-apppointment-symptoms';

describe('ScheduleApppointmentSymptoms', () => {
  let component: ScheduleApppointmentSymptoms;
  let fixture: ComponentFixture<ScheduleApppointmentSymptoms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleApppointmentSymptoms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleApppointmentSymptoms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
