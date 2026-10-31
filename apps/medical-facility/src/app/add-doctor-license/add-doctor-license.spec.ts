import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorLicense } from './add-doctor-license';

describe('AddDoctorLicense', () => {
  let component: AddDoctorLicense;
  let fixture: ComponentFixture<AddDoctorLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDoctorLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoctorLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
