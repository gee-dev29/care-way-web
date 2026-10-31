import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLabTechnicianLicense } from './upload-lab-technician-license';

describe('UploadLabTechnicianLicense', () => {
  let component: UploadLabTechnicianLicense;
  let fixture: ComponentFixture<UploadLabTechnicianLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadLabTechnicianLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadLabTechnicianLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
