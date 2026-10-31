import { TestBed } from '@angular/core/testing';

import { Pushservice } from './pushservice';

describe('Pushservice', () => {
  let service: Pushservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pushservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
