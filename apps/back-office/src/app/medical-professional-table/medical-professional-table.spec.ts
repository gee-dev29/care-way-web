import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalProfessionalTable } from './medical-professional-table';

describe('MedicalProfessionalTable', () => {
  let component: MedicalProfessionalTable;
  let fixture: ComponentFixture<MedicalProfessionalTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalProfessionalTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalProfessionalTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
