import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedEmptyAddress } from './shared-empty-address';

describe('SharedEmptyAddress', () => {
  let component: SharedEmptyAddress;
  let fixture: ComponentFixture<SharedEmptyAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedEmptyAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedEmptyAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
