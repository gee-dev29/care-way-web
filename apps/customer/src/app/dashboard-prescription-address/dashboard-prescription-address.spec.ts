import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPrescriptionAddress } from './dashboard-prescription-address';

describe('DashboardPrescriptionAddress', () => {
  let component: DashboardPrescriptionAddress;
  let fixture: ComponentFixture<DashboardPrescriptionAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPrescriptionAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPrescriptionAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
