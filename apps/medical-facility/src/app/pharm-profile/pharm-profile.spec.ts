import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmProfile } from './pharm-profile';

describe('PharmProfile', () => {
  let component: PharmProfile;
  let fixture: ComponentFixture<PharmProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
