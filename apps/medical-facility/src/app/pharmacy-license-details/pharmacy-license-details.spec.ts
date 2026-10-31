import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyLicenseDetails } from './pharmacy-license-details';

describe('PharmacyLicenseDetails', () => {
  let component: PharmacyLicenseDetails;
  let fixture: ComponentFixture<PharmacyLicenseDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyLicenseDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyLicenseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
