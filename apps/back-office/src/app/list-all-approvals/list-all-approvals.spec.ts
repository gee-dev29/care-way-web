import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllApprovals } from './list-all-approvals';

describe('ListAllApprovals', () => {
  let component: ListAllApprovals;
  let fixture: ComponentFixture<ListAllApprovals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllApprovals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllApprovals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
