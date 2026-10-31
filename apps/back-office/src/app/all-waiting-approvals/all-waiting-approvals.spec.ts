import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWaitingApprovals } from './all-waiting-approvals';

describe('AllWaitingApprovals', () => {
  let component: AllWaitingApprovals;
  let fixture: ComponentFixture<AllWaitingApprovals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllWaitingApprovals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllWaitingApprovals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
