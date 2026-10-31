import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMore } from './dashboard-more';

describe('DashboardMore', () => {
  let component: DashboardMore;
  let fixture: ComponentFixture<DashboardMore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
