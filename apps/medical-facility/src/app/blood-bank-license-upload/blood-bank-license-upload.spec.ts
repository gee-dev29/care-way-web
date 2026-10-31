import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankLicenseUpload } from './blood-bank-license-upload';

describe('BloodBankLicenseUpload', () => {
  let component: BloodBankLicenseUpload;
  let fixture: ComponentFixture<BloodBankLicenseUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankLicenseUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankLicenseUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
