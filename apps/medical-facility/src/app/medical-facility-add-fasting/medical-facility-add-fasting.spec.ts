import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityAddFasting } from './medical-facility-add-fasting';

describe('MedicalFacilityAddFasting', () => {
  let component: MedicalFacilityAddFasting;
  let fixture: ComponentFixture<MedicalFacilityAddFasting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityAddFasting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityAddFasting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
