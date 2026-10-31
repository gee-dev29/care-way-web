import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityDetailsCard } from './medical-facility-details-card';

describe('MedicalFacilityDetailsCard', () => {
  let component: MedicalFacilityDetailsCard;
  let fixture: ComponentFixture<MedicalFacilityDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
