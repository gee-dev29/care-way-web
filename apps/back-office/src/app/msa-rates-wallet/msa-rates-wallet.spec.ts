import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaRatesWallet } from './msa-rates-wallet';

describe('MsaRatesWallet', () => {
  let component: MsaRatesWallet;
  let fixture: ComponentFixture<MsaRatesWallet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsaRatesWallet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsaRatesWallet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
