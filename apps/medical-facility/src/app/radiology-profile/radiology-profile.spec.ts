import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyProfile } from './radiology-profile';

describe('RadiologyProfile', () => {
  let component: RadiologyProfile;
  let fixture: ComponentFixture<RadiologyProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologyProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologyProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
