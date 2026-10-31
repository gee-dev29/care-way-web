import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmListAddress } from './pharm-list-address';

describe('PharmListAddress', () => {
  let component: PharmListAddress;
  let fixture: ComponentFixture<PharmListAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmListAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmListAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
