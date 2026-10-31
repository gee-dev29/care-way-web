import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentVideoCall } from './appointment-video-call';

describe('AppointmentVideoCall', () => {
  let component: AppointmentVideoCall;
  let fixture: ComponentFixture<AppointmentVideoCall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentVideoCall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentVideoCall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
