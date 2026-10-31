import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAvailableAppointments } from './doctor-available-appointments';

describe('DoctorAvailableAppointments', () => {
  let component: DoctorAvailableAppointments;
  let fixture: ComponentFixture<DoctorAvailableAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAvailableAppointments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAvailableAppointments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
