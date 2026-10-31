import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAddAddress } from './shared-add-address';

describe('SharedAddAddress', () => {
  let component: SharedAddAddress;
  let fixture: ComponentFixture<SharedAddAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAddAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedAddAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
