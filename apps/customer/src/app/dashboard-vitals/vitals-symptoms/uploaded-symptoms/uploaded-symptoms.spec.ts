import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedSymptoms } from './uploaded-symptoms';

describe('UploadedSymptoms', () => {
  let component: UploadedSymptoms;
  let fixture: ComponentFixture<UploadedSymptoms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadedSymptoms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedSymptoms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
