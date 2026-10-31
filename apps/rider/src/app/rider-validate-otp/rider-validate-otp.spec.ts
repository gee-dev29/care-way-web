import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderValidateOtp } from './rider-validate-otp';

describe('RiderValidateOtp', () => {
  let component: RiderValidateOtp;
  let fixture: ComponentFixture<RiderValidateOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderValidateOtp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderValidateOtp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
