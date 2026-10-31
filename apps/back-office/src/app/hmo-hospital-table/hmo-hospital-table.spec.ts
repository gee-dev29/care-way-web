import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoHospitalTable } from './hmo-hospital-table';

describe('HmoHospitalTable', () => {
  let component: HmoHospitalTable;
  let fixture: ComponentFixture<HmoHospitalTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmoHospitalTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmoHospitalTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
