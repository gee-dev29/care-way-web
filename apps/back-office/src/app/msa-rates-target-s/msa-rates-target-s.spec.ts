import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaRatesTargetS } from './msa-rates-target-s';

describe('MsaRatesTargetS', () => {
  let component: MsaRatesTargetS;
  let fixture: ComponentFixture<MsaRatesTargetS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsaRatesTargetS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsaRatesTargetS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
