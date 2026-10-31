import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPrescriptionAddAddress } from './dashboard-prescription-add-address';

describe('DashboardPrescriptionAddAddress', () => {
  let component: DashboardPrescriptionAddAddress;
  let fixture: ComponentFixture<DashboardPrescriptionAddAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPrescriptionAddAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPrescriptionAddAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
