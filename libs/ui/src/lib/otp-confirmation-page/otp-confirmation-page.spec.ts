import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpConfirmationPage } from './otp-confirmation-page';

describe('OtpConfirmationPage', () => {
  let component: OtpConfirmationPage;
  let fixture: ComponentFixture<OtpConfirmationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpConfirmationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
