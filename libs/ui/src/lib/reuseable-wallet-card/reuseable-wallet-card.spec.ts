import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuseableWalletCard } from './reuseable-wallet-card';

describe('ReuseableWalletCard', () => {
  let component: ReuseableWalletCard;
  let fixture: ComponentFixture<ReuseableWalletCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReuseableWalletCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuseableWalletCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
