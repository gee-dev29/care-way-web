import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmUpload } from './pharm-upload';

describe('PharmUpload', () => {
  let component: PharmUpload;
  let fixture: ComponentFixture<PharmUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
