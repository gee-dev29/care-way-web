import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityDetails } from './medical-facility-details';

describe('MedicalFacilityDetails', () => {
  let component: MedicalFacilityDetails;
  let fixture: ComponentFixture<MedicalFacilityDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
