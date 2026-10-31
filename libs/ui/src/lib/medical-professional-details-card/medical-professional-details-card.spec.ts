import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalProfessionalDetailsCard } from './medical-professional-details-card';

describe('MedicalProfessionalDetailsCard', () => {
  let component: MedicalProfessionalDetailsCard;
  let fixture: ComponentFixture<MedicalProfessionalDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalProfessionalDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalProfessionalDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
