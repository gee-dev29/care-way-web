import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityAddRandom } from './medical-facility-add-random';

describe('MedicalFacilityAddRandom', () => {
  let component: MedicalFacilityAddRandom;
  let fixture: ComponentFixture<MedicalFacilityAddRandom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityAddRandom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityAddRandom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
