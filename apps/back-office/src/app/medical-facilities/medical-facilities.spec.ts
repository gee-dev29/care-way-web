import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilities } from './medical-facilities';

describe('MedicalFacilities', () => {
  let component: MedicalFacilities;
  let fixture: ComponentFixture<MedicalFacilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
