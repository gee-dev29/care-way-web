import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityAddOgtt } from './medical-facility-add-ogtt';

describe('MedicalFacilityAddOgtt', () => {
  let component: MedicalFacilityAddOgtt;
  let fixture: ComponentFixture<MedicalFacilityAddOgtt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityAddOgtt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityAddOgtt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
