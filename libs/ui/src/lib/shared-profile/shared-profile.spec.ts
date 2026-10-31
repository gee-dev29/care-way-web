import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedProfile } from './shared-profile';

describe('SharedProfile', () => {
  let component: SharedProfile;
  let fixture: ComponentFixture<SharedProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
