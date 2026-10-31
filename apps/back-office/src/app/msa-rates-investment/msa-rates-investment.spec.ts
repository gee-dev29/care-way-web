import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaRatesInvestment } from './msa-rates-investment';

describe('MsaRatesInvestment', () => {
  let component: MsaRatesInvestment;
  let fixture: ComponentFixture<MsaRatesInvestment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsaRatesInvestment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsaRatesInvestment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
