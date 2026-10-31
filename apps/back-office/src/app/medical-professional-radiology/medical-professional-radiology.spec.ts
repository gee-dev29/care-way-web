import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalProfessionalRadiology } from './medical-professional-radiology';

describe('MedicalProfessionalRadiology', () => {
  let component: MedicalProfessionalRadiology;
  let fixture: ComponentFixture<MedicalProfessionalRadiology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalProfessionalRadiology]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalProfessionalRadiology);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
