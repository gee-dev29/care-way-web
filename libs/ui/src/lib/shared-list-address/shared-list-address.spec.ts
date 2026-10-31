import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedListAddress } from './shared-list-address';

describe('SharedListAddress', () => {
  let component: SharedListAddress;
  let fixture: ComponentFixture<SharedListAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedListAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedListAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
