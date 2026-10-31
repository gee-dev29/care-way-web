import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPendingApprovals } from './all-pending-approvals';

describe('AllPendingApprovals', () => {
  let component: AllPendingApprovals;
  let fixture: ComponentFixture<AllPendingApprovals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPendingApprovals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPendingApprovals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
