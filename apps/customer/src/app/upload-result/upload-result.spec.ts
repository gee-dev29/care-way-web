import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadResult } from './upload-result';

describe('UploadResult', () => {
  let component: UploadResult;
  let fixture: ComponentFixture<UploadResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
