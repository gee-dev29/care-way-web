import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityAddWeight } from './medical-facility-add-weight';

describe('MedicalFacilityAddWeight', () => {
  let component: MedicalFacilityAddWeight;
  let fixture: ComponentFixture<MedicalFacilityAddWeight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityAddWeight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityAddWeight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
