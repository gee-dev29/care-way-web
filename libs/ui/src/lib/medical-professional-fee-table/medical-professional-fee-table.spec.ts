import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalProfessionalFeeTable } from './medical-professional-fee-table';

describe('MedicalProfessionalFeeTable', () => {
  let component: MedicalProfessionalFeeTable;
  let fixture: ComponentFixture<MedicalProfessionalFeeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalProfessionalFeeTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalProfessionalFeeTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
