import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTechnicianProfile } from './lab-technician-profile';

describe('LabTechnicianProfile', () => {
  let component: LabTechnicianProfile;
  let fixture: ComponentFixture<LabTechnicianProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTechnicianProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTechnicianProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
