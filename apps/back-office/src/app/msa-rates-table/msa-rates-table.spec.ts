import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaRatesTable } from './msa-rates-table';

describe('MsaRatesTable', () => {
  let component: MsaRatesTable;
  let fixture: ComponentFixture<MsaRatesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsaRatesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsaRatesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
