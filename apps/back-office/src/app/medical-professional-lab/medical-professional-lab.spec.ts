import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalProfessionalLab } from './medical-professional-lab';

describe('MedicalProfessionalLab', () => {
  let component: MedicalProfessionalLab;
  let fixture: ComponentFixture<MedicalProfessionalLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalProfessionalLab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalProfessionalLab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
