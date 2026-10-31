import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPharmacistLicense } from './upload-pharmacist-license';

describe('UploadPharmacistLicense', () => {
  let component: UploadPharmacistLicense;
  let fixture: ComponentFixture<UploadPharmacistLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPharmacistLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPharmacistLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
