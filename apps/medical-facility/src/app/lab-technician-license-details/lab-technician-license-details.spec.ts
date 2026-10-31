import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTechnicianLicenseDetails } from './lab-technician-license-details';

describe('LabTechnicianLicenseDetails', () => {
  let component: LabTechnicianLicenseDetails;
  let fixture: ComponentFixture<LabTechnicianLicenseDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTechnicianLicenseDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTechnicianLicenseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
