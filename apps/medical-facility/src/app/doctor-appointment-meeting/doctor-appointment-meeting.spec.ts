import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAppointmentMeeting } from './doctor-appointment-meeting';

describe('DoctorAppointmentMeeting', () => {
  let component: DoctorAppointmentMeeting;
  let fixture: ComponentFixture<DoctorAppointmentMeeting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAppointmentMeeting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAppointmentMeeting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
