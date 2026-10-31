import { TestBed } from '@angular/core/testing';

import { CalendarReminder } from './calendar-reminder';

describe('CalendarReminder', () => {
  let service: CalendarReminder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarReminder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
