import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardConnectionRequests } from './dashboard-connection-requests';

describe('DashboardConnectionRequests', () => {
  let component: DashboardConnectionRequests;
  let fixture: ComponentFixture<DashboardConnectionRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardConnectionRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardConnectionRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
