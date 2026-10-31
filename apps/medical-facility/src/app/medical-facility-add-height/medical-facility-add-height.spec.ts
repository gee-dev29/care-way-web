import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityAddHeight } from './medical-facility-add-height';

describe('MedicalFacilityAddHeight', () => {
  let component: MedicalFacilityAddHeight;
  let fixture: ComponentFixture<MedicalFacilityAddHeight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityAddHeight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityAddHeight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
