import { TestBed } from '@angular/core/testing';

import { SetCountry } from './set-country';

describe('SetCountry', () => {
  let service: SetCountry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetCountry);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
