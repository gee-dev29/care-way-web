import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyValidateOtp } from './agency-validate-otp';

describe('AgencyValidateOtp', () => {
  let component: AgencyValidateOtp;
  let fixture: ComponentFixture<AgencyValidateOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyValidateOtp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyValidateOtp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
