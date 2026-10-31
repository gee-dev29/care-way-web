import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAllMembers } from './dashboard-all-members';

describe('DashboardAllMembers', () => {
  let component: DashboardAllMembers;
  let fixture: ComponentFixture<DashboardAllMembers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAllMembers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAllMembers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
