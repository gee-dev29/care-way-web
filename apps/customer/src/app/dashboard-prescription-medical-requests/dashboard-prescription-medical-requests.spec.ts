import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPrescriptionMedicalRequests } from './dashboard-prescription-medical-requests';

describe('DashboardPrescriptionMedicalRequests', () => {
  let component: DashboardPrescriptionMedicalRequests;
  let fixture: ComponentFixture<DashboardPrescriptionMedicalRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPrescriptionMedicalRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPrescriptionMedicalRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
