import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankEmptyAddress } from './blood-bank-empty-address';

describe('BloodBankEmptyAddress', () => {
  let component: BloodBankEmptyAddress;
  let fixture: ComponentFixture<BloodBankEmptyAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankEmptyAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankEmptyAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
