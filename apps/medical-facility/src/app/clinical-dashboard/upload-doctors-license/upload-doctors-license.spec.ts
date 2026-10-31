import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDoctorsLicense } from './upload-doctors-license';

describe('UploadDoctorsLicense', () => {
  let component: UploadDoctorsLicense;
  let fixture: ComponentFixture<UploadDoctorsLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDoctorsLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDoctorsLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
