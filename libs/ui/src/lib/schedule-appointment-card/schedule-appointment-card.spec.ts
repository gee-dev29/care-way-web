import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAppointmentCard } from './schedule-appointment-card';

describe('ScheduleAppointmentCard', () => {
  let component: ScheduleAppointmentCard;
  let fixture: ComponentFixture<ScheduleAppointmentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleAppointmentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAppointmentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
