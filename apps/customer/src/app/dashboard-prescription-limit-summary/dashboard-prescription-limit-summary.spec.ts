import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPrescriptionLimitSummary } from './dashboard-prescription-limit-summary';

describe('DashboardPrescriptionLimitSummary', () => {
  let component: DashboardPrescriptionLimitSummary;
  let fixture: ComponentFixture<DashboardPrescriptionLimitSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPrescriptionLimitSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPrescriptionLimitSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
