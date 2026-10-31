import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDoctorToAppointment } from './assign-doctor-to-appointment';

describe('AssignDoctorToAppointment', () => {
  let component: AssignDoctorToAppointment;
  let fixture: ComponentFixture<AssignDoctorToAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDoctorToAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignDoctorToAppointment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
