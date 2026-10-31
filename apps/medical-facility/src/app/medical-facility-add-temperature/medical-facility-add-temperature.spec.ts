import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityAddTemperature } from './medical-facility-add-temperature';

describe('MedicalFacilityAddTemperature', () => {
  let component: MedicalFacilityAddTemperature;
  let fixture: ComponentFixture<MedicalFacilityAddTemperature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityAddTemperature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityAddTemperature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
