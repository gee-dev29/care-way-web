import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmAddAddress } from './pharm-add-address';

describe('PharmAddAddress', () => {
  let component: PharmAddAddress;
  let fixture: ComponentFixture<PharmAddAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmAddAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmAddAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
