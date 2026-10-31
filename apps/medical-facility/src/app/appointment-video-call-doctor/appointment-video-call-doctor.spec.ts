import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentVideoCallDoctor } from './appointment-video-call-doctor';

describe('AppointmentVideoCallDoctor', () => {
  let component: AppointmentVideoCallDoctor;
  let fixture: ComponentFixture<AppointmentVideoCallDoctor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentVideoCallDoctor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentVideoCallDoctor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
