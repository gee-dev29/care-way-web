import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryProfessionalDetails } from './laboratory-professional-details';

describe('LaboratoryProfessionalDetails', () => {
  let component: LaboratoryProfessionalDetails;
  let fixture: ComponentFixture<LaboratoryProfessionalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratoryProfessionalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratoryProfessionalDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
