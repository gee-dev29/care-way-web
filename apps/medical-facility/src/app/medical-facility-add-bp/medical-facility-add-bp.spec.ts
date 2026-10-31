import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityAddBp } from './medical-facility-add-bp';

describe('MedicalFacilityAddBp', () => {
  let component: MedicalFacilityAddBp;
  let fixture: ComponentFixture<MedicalFacilityAddBp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityAddBp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityAddBp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
