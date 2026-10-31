import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientistProfile } from './scientist-profile';

describe('ScientistProfile', () => {
  let component: ScientistProfile;
  let fixture: ComponentFixture<ScientistProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScientistProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScientistProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
