import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmEmptyAddress } from './pharm-empty-address';

describe('PharmEmptyAddress', () => {
  let component: PharmEmptyAddress;
  let fixture: ComponentFixture<PharmEmptyAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmEmptyAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmEmptyAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
