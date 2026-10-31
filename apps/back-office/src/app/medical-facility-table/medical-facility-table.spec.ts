import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFacilityTable } from './medical-facility-table';

describe('MedicalFacilityTable', () => {
  let component: MedicalFacilityTable;
  let fixture: ComponentFixture<MedicalFacilityTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFacilityTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalFacilityTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
