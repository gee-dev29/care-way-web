import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodBankAddressList } from './blood-bank-address-list';

describe('BloodBankAddressList', () => {
  let component: BloodBankAddressList;
  let fixture: ComponentFixture<BloodBankAddressList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodBankAddressList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodBankAddressList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
