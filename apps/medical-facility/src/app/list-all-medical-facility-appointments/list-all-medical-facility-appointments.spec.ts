import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllMedicalFacilityAppointments } from './list-all-medical-facility-appointments';

describe('ListAllMedicalFacilityAppointments', () => {
  let component: ListAllMedicalFacilityAppointments;
  let fixture: ComponentFixture<ListAllMedicalFacilityAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllMedicalFacilityAppointments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllMedicalFacilityAppointments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
