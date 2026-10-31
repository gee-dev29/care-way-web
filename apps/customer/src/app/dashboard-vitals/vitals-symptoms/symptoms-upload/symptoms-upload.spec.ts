import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomsUpload } from './symptoms-upload';

describe('SymptomsUpload', () => {
  let component: SymptomsUpload;
  let fixture: ComponentFixture<SymptomsUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomsUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymptomsUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
