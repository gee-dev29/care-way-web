import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyDashboard } from './radiology-dashboard';

describe('RadiologyDashboard', () => {
  let component: RadiologyDashboard;
  let fixture: ComponentFixture<RadiologyDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologyDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadiologyDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
