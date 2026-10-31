import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPhysicalForm } from './hospital-physical-form';

describe('HospitalPhysicalForm', () => {
  let component: HospitalPhysicalForm;
  let fixture: ComponentFixture<HospitalPhysicalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalPhysicalForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalPhysicalForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
