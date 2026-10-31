import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaRatesTargetL } from './msa-rates-target-l';

describe('MsaRatesTargetL', () => {
  let component: MsaRatesTargetL;
  let fixture: ComponentFixture<MsaRatesTargetL>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsaRatesTargetL]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsaRatesTargetL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
