import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpRequest } from './follow-up-request';

describe('FollowUpRequest', () => {
  let component: FollowUpRequest;
  let fixture: ComponentFixture<FollowUpRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowUpRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
