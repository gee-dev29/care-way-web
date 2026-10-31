import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllMedicalFacilities } from './list-all-medical-facilities';

describe('ListAllMedicalFacilities', () => {
  let component: ListAllMedicalFacilities;
  let fixture: ComponentFixture<ListAllMedicalFacilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllMedicalFacilities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllMedicalFacilities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
