import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientistLicenseDetails } from './scientist-license-details';

describe('ScientistLicenseDetails', () => {
  let component: ScientistLicenseDetails;
  let fixture: ComponentFixture<ScientistLicenseDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScientistLicenseDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScientistLicenseDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
