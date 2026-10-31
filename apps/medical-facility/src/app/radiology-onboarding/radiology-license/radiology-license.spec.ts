import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalLicense } from './hospital-license';

describe('HospitalLicense', () => {
  let component: HospitalLicense;
  let fixture: ComponentFixture<HospitalLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
