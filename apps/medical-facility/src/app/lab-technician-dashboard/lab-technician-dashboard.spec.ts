import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTechnicianDashboard } from './lab-technician-dashboard';

describe('LabTechnicianDashboard', () => {
  let component: LabTechnicianDashboard;
  let fixture: ComponentFixture<LabTechnicianDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTechnicianDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTechnicianDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
