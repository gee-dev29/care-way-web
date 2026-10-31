import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRadiologistLicense } from './upload-radiologist-license';

describe('UploadRadiologistLicense', () => {
  let component: UploadRadiologistLicense;
  let fixture: ComponentFixture<UploadRadiologistLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadRadiologistLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadRadiologistLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
