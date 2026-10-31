import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAvailableHospital } from './doctor-available-hospital';

describe('DoctorAvailableHospital', () => {
  let component: DoctorAvailableHospital;
  let fixture: ComponentFixture<DoctorAvailableHospital>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAvailableHospital]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAvailableHospital);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
