import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsProfile } from './doctors-profile';

describe('DoctorsProfile', () => {
  let component: DoctorsProfile;
  let fixture: ComponentFixture<DoctorsProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
