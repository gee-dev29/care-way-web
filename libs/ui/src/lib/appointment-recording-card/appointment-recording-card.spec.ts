import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRecordingCard } from './appointment-recording-card';

describe('AppointmentRecordingCard', () => {
  let component: AppointmentRecordingCard;
  let fixture: ComponentFixture<AppointmentRecordingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentRecordingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentRecordingCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
