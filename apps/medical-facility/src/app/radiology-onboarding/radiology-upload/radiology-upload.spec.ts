import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalUpload } from './hospital-upload';

describe('HospitalUpload', () => {
  let component: HospitalUpload;
  let fixture: ComponentFixture<HospitalUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
