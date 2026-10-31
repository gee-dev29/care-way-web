import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAddAddress } from './dashboard-add-address';

describe('DashboardAddAddress', () => {
  let component: DashboardAddAddress;
  let fixture: ComponentFixture<DashboardAddAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAddAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAddAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
