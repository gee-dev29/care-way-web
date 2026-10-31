import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaRatesFuture } from './msa-rates-future';

describe('MsaRatesFuture', () => {
  let component: MsaRatesFuture;
  let fixture: ComponentFixture<MsaRatesFuture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsaRatesFuture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsaRatesFuture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
