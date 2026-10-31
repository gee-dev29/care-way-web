import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalRouteDetails } from './approval-route-details';

describe('ApprovalRouteDetails', () => {
  let component: ApprovalRouteDetails;
  let fixture: ComponentFixture<ApprovalRouteDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalRouteDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalRouteDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
