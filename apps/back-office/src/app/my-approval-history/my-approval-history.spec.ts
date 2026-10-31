import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyApprovalHistory } from './my-approval-history';

describe('MyApprovalHistory', () => {
  let component: MyApprovalHistory;
  let fixture: ComponentFixture<MyApprovalHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyApprovalHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyApprovalHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
