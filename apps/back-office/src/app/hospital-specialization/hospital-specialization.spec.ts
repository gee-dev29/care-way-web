import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalSpecialization } from './hospital-specialization';

describe('HospitalSpecialization', () => {
  let component: HospitalSpecialization;
  let fixture: ComponentFixture<HospitalSpecialization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalSpecialization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalSpecialization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
