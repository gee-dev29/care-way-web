import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCard } from './wallet-card';

describe('WalletCard', () => {
  let component: WalletCard;
  let fixture: ComponentFixture<WalletCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
