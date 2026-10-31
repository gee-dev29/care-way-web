import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAgency } from './dashboard-agency';

describe('DashboardAgency', () => {
  let component: DashboardAgency;
  let fixture: ComponentFixture<DashboardAgency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAgency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAgency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
