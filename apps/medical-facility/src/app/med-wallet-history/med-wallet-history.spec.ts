import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedWalletHistory } from './med-wallet-history';

describe('MedWalletHistory', () => {
  let component: MedWalletHistory;
  let fixture: ComponentFixture<MedWalletHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedWalletHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedWalletHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
