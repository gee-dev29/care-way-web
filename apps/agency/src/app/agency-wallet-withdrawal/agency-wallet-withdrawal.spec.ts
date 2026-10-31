import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyWalletWithdrawal } from './agency-wallet-withdrawal';

describe('AgencyWalletWithdrawal', () => {
  let component: AgencyWalletWithdrawal;
  let fixture: ComponentFixture<AgencyWalletWithdrawal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyWalletWithdrawal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyWalletWithdrawal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
