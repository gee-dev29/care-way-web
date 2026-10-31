import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointmentAvailabilityCard } from './doctors-appointment-availability-card';

describe('DoctorsAppointmentAvailabilityCard', () => {
  let component: DoctorsAppointmentAvailabilityCard;
  let fixture: ComponentFixture<DoctorsAppointmentAvailabilityCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsAppointmentAvailabilityCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsAppointmentAvailabilityCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
