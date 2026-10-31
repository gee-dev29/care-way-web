import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCardDetails } from './patient-card-details';

describe('PatientCardDetails', () => {
  let component: PatientCardDetails;
  let fixture: ComponentFixture<PatientCardDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCardDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCardDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
