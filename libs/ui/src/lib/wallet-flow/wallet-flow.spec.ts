import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletFlow } from './wallet-flow';

describe('WalletFlow', () => {
  let component: WalletFlow;
  let fixture: ComponentFixture<WalletFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletFlow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
