import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderWalletCard } from './rider-wallet-card';

describe('RiderWalletCard', () => {
  let component: RiderWalletCard;
  let fixture: ComponentFixture<RiderWalletCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderWalletCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderWalletCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
