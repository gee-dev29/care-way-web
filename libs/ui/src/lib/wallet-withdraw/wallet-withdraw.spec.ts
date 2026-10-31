import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletWithdraw } from './wallet-withdraw';

describe('WalletWithdraw', () => {
  let component: WalletWithdraw;
  let fixture: ComponentFixture<WalletWithdraw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletWithdraw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletWithdraw);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
