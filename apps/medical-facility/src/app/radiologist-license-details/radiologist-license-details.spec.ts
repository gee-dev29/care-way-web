import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologistLicenseDetails } from './radiologist-license-details';

describe('RadiologistLicenseDetails', () => {
  let component: RadiologistLicenseDetails;
  let fixture: ComponentFixture<RadiologistLicenseDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologistLicenseDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologistLicenseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
