import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderWalletHistory } from './rider-wallet-history';

describe('RiderWalletHistory', () => {
  let component: RiderWalletHistory;
  let fixture: ComponentFixture<RiderWalletHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderWalletHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderWalletHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
