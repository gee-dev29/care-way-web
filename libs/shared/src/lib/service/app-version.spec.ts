import { TestBed } from '@angular/core/testing';

import { AppVersion } from './app-version';

describe('AppVersion', () => {
  let service: AppVersion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppVersion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
