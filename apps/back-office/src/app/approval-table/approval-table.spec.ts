import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTable } from './approval-table';

describe('ApprovalTable', () => {
  let component: ApprovalTable;
  let fixture: ComponentFixture<ApprovalTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
