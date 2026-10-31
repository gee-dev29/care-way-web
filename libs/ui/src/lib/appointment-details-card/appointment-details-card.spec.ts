import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailsCard } from './appointment-details-card';

describe('AppointmentDetailsCard', () => {
  let component: AppointmentDetailsCard;
  let fixture: ComponentFixture<AppointmentDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
