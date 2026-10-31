import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadScientistLicense } from './upload-scientist-license';

describe('UploadScientistLicense', () => {
  let component: UploadScientistLicense;
  let fixture: ComponentFixture<UploadScientistLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadScientistLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadScientistLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
