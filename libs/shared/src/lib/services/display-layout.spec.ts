import { TestBed } from '@angular/core/testing';

import { DisplayLayout } from './display-layout';

describe('DisplayLayout', () => {
  let service: DisplayLayout;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayLayout);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
