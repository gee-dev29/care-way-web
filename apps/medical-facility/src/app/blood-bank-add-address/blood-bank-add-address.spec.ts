import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankAddAddress } from './blood-bank-add-address';

describe('BloodBankAddAddress', () => {
  let component: BloodBankAddAddress;
  let fixture: ComponentFixture<BloodBankAddAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankAddAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankAddAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
