import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ApprovalTimeline } from './approval-timeline';

describe('ApprovalTimeline', () => {
  let component: ApprovalTimeline;
  let fixture: ComponentFixture<ApprovalTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalTimeline],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate progress', () => {
    const steps = [{ state: 'approved' }, { state: 'current' }];
    expect(component.getApprovedCount(steps)).toBe(1);
    expect(component.getProgress(steps)).toBe(50);
  });
});
