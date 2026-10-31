import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPendingApprovals } from './my-pending-approvals';

describe('MyPendingApprovals', () => {
  let component: MyPendingApprovals;
  let fixture: ComponentFixture<MyPendingApprovals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPendingApprovals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPendingApprovals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
