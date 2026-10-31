import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRider } from './dashboard-rider';

describe('DashboardRider', () => {
  let component: DashboardRider;
  let fixture: ComponentFixture<DashboardRider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
