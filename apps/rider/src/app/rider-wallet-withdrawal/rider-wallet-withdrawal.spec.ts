import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderWalletWithdrawal } from './rider-wallet-withdrawal';

describe('RiderWalletWithdrawal', () => {
  let component: RiderWalletWithdrawal;
  let fixture: ComponentFixture<RiderWalletWithdrawal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderWalletWithdrawal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderWalletWithdrawal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
