import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCardTypes } from './patient-card-types';

describe('PatientCardTypes', () => {
  let component: PatientCardTypes;
  let fixture: ComponentFixture<PatientCardTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCardTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCardTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
