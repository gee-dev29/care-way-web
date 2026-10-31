import { TestBed } from '@angular/core/testing';

import { VitalsRefresh } from './vitals-refresh';

describe('VitalsRefresh', () => {
  let service: VitalsRefresh;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VitalsRefresh);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
