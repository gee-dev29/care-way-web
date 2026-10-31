import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPrescription } from './dashboard-prescription';

describe('DashboardPrescription', () => {
  let component: DashboardPrescription;
  let fixture: ComponentFixture<DashboardPrescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPrescription]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPrescription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
