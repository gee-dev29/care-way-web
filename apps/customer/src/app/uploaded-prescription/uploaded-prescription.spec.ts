import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedPrescription } from './uploaded-prescription';

describe('UploadedPrescription', () => {
  let component: UploadedPrescription;
  let fixture: ComponentFixture<UploadedPrescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadedPrescription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedPrescription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
