import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalAddPatientCardType } from './hospital-add-patient-card-type';

describe('HospitalAddPatientCardType', () => {
  let component: HospitalAddPatientCardType;
  let fixture: ComponentFixture<HospitalAddPatientCardType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalAddPatientCardType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalAddPatientCardType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
