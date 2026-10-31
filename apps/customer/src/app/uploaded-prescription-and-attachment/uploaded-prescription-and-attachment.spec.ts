import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedPrescriptionAndAttachment } from './uploaded-prescription-and-attachment';

describe('UploadedPrescriptionAndAttachment', () => {
  let component: UploadedPrescriptionAndAttachment;
  let fixture: ComponentFixture<UploadedPrescriptionAndAttachment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadedPrescriptionAndAttachment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedPrescriptionAndAttachment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
