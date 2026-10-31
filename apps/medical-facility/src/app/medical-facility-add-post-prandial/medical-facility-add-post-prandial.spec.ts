import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityAddPostPrandial } from './medical-facility-add-post-prandial';

describe('MedicalFacilityAddPostPrandial', () => {
  let component: MedicalFacilityAddPostPrandial;
  let fixture: ComponentFixture<MedicalFacilityAddPostPrandial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityAddPostPrandial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityAddPostPrandial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
