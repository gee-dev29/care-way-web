import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedWalletWithdrawal } from './med-wallet-withdrawal';

describe('MedWalletWithdrawal', () => {
  let component: MedWalletWithdrawal;
  let fixture: ComponentFixture<MedWalletWithdrawal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedWalletWithdrawal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedWalletWithdrawal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
