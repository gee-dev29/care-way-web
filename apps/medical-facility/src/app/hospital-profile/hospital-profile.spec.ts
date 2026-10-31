import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalProfile } from './hospital-profile';

describe('HospitalProfile', () => {
  let component: HospitalProfile;
  let fixture: ComponentFixture<HospitalProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
