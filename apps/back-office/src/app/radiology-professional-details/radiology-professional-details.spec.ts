import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyProfessionalDetails } from './radiology-professional-details';

describe('RadiologyProfessionalDetails', () => {
  let component: RadiologyProfessionalDetails;
  let fixture: ComponentFixture<RadiologyProfessionalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologyProfessionalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologyProfessionalDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
