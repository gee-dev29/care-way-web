import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ApprovalState } from '@care-way/shared';

import { ApprovalService } from './approval.service';

describe('ApprovalService', () => {
  let service: ApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    service = TestBed.inject(ApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should order history, current and upcoming steps', () => {
    const steps = service.getSteps(
      [{ name: 'Ada Obi', isApproved: true }],
      { name: 'Tunde Bello', userId: 'me', slaInHours: '2', dateOfRequest: '2020-01-01T00:00:00Z' },
      [{ name: 'Kemi' }],
      'me'
    );
    expect(steps.map((step) => step.state)).toEqual(['approved', 'current', 'upcoming']);
    expect(steps[1].isYou).toBe(true);
  });

  it('should keep the rejection reason', () => {
    const [step] = service.getSteps(
      [{ name: 'Ada', isApproved: false, reason: ' Missing invoice ', dateOfUpdate: '2020-01-01T00:00:00Z' }],
      null,
      [],
      'me'
    );
    expect(step.state).toBe('rejected');
    expect(step.reason).toBe('Missing invoice');
    expect(step.respondedAt).toBe('2020-01-01T00:00:00Z');
  });

  it('should allow resubmitting after a rejection', () => {
    expect(service.setApproval({}, ApprovalState.Rejected, [], null, []).canInitiate).toBe(true);
    expect(service.setApproval({}, ApprovalState.Active, [], null, []).canInitiate).toBe(false);
  });

  it('should build initials', () => {
    expect(service.getInitials('ada grace obi')).toBe('AO');
    expect(service.getInitials('')).toBe('?');
  });
});
