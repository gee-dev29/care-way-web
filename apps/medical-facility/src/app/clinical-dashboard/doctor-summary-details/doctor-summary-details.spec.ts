import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSummaryDetails } from './doctor-summary-details';

describe('DoctorSummaryDetails', () => {
  let component: DoctorSummaryDetails;
  let fixture: ComponentFixture<DoctorSummaryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSummaryDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSummaryDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
