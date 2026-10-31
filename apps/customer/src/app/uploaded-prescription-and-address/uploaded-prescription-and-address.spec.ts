import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedPrescriptionAndAddress } from './uploaded-prescription-and-address';

describe('UploadedPrescriptionAndAddress', () => {
  let component: UploadedPrescriptionAndAddress;
  let fixture: ComponentFixture<UploadedPrescriptionAndAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadedPrescriptionAndAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedPrescriptionAndAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
