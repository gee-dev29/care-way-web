import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologistProfile } from './radiologist-profile';

describe('RadiologistProfile', () => {
  let component: RadiologistProfile;
  let fixture: ComponentFixture<RadiologistProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologistProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologistProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
