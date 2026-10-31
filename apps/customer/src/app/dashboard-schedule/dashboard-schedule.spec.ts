import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSchedule } from './dashboard-schedule';

describe('DashboardSchedule', () => {
  let component: DashboardSchedule;
  let fixture: ComponentFixture<DashboardSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
