import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCardType } from './appointment-card-type';

describe('AppointmentCardType', () => {
  let component: AppointmentCardType;
  let fixture: ComponentFixture<AppointmentCardType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCardType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentCardType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
