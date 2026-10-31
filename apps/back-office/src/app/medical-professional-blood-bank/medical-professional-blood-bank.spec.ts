import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalProfessionalBloodBank } from './medical-professional-blood-bank';

describe('MedicalProfessionalBloodBank', () => {
  let component: MedicalProfessionalBloodBank;
  let fixture: ComponentFixture<MedicalProfessionalBloodBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalProfessionalBloodBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalProfessionalBloodBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
