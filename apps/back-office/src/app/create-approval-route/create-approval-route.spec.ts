import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApprovalRoute } from './create-approval-route';

describe('CreateApprovalRoute', () => {
  let component: CreateApprovalRoute;
  let fixture: ComponentFixture<CreateApprovalRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApprovalRoute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateApprovalRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
