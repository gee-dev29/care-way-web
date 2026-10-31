import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSummaryDetails } from './appointment-summary-details';

describe('AppointmentSummaryDetails', () => {
  let component: AppointmentSummaryDetails;
  let fixture: ComponentFixture<AppointmentSummaryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSummaryDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSummaryDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
