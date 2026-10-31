import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPatientCardTypes } from './hospital-patient-card-types';

describe('HospitalPatientCardTypes', () => {
  let component: HospitalPatientCardTypes;
  let fixture: ComponentFixture<HospitalPatientCardTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalPatientCardTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalPatientCardTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
