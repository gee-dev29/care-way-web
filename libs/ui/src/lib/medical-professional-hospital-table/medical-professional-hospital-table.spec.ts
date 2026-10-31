import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalProfessionalHospitalTable } from './medical-professional-hospital-table';

describe('MedicalProfessionalHospitalTable', () => {
  let component: MedicalProfessionalHospitalTable;
  let fixture: ComponentFixture<MedicalProfessionalHospitalTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalProfessionalHospitalTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalProfessionalHospitalTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
