import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalRouteCard } from './approval-route-card';

describe('ApprovalRouteCard', () => {
  let component: ApprovalRouteCard;
  let fixture: ComponentFixture<ApprovalRouteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalRouteCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalRouteCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
