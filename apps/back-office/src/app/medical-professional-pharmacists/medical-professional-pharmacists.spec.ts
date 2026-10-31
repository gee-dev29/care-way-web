import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalProfessionalPharmacists } from './medical-professional-pharmacists';

describe('MedicalProfessionalPharmacists', () => {
  let component: MedicalProfessionalPharmacists;
  let fixture: ComponentFixture<MedicalProfessionalPharmacists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalProfessionalPharmacists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalProfessionalPharmacists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
