import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAllOrders } from './dashboard-all-orders';

describe('DashboardAllOrders', () => {
  let component: DashboardAllOrders;
  let fixture: ComponentFixture<DashboardAllOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAllOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAllOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
