import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCardPrimary } from './appointment-card-primary';

describe('AppointmentCardPrimary', () => {
  let component: AppointmentCardPrimary;
  let fixture: ComponentFixture<AppointmentCardPrimary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCardPrimary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentCardPrimary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
