import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDriverLicense } from './upload-driver-license';

describe('UploadDriverLicense', () => {
  let component: UploadDriverLicense;
  let fixture: ComponentFixture<UploadDriverLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDriverLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDriverLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
