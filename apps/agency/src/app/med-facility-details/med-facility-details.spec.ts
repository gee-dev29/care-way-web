import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedFacilityDetails } from './med-facility-details';

describe('MedFacilityDetails', () => {
  let component: MedFacilityDetails;
  let fixture: ComponentFixture<MedFacilityDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedFacilityDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedFacilityDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
