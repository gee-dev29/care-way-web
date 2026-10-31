import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaRatesTargetM } from './msa-rates-target-m';

describe('MsaRatesTargetM', () => {
  let component: MsaRatesTargetM;
  let fixture: ComponentFixture<MsaRatesTargetM>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsaRatesTargetM]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsaRatesTargetM);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
