import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityAddOxygenSaturation } from './medical-facility-add-oxygen-saturation';

describe('MedicalFacilityAddOxygenSaturation', () => {
  let component: MedicalFacilityAddOxygenSaturation;
  let fixture: ComponentFixture<MedicalFacilityAddOxygenSaturation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityAddOxygenSaturation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityAddOxygenSaturation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
