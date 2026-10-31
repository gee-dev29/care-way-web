import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedValidateOtp } from './med-validate-otp';

describe('MedValidateOtp', () => {
  let component: MedValidateOtp;
  let fixture: ComponentFixture<MedValidateOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedValidateOtp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedValidateOtp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
