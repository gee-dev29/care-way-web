import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCostFlow } from './dashboard-cost-flow';

describe('DashboardCostFlow', () => {
  let component: DashboardCostFlow;
  let fixture: ComponentFixture<DashboardCostFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCostFlow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCostFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
