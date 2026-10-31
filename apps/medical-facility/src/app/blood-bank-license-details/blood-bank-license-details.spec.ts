import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankLicenseDetails } from './blood-bank-license-details';

describe('BloodBankLicenseDetails', () => {
  let component: BloodBankLicenseDetails;
  let fixture: ComponentFixture<BloodBankLicenseDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankLicenseDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankLicenseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
