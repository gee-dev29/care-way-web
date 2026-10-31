import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientUpload } from './patient-upload';

describe('PatientUpload', () => {
  let component: PatientUpload;
  let fixture: ComponentFixture<PatientUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
