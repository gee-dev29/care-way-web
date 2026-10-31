import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOrderRider } from './all-order-rider';

describe('AllOrderRider', () => {
  let component: AllOrderRider;
  let fixture: ComponentFixture<AllOrderRider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllOrderRider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOrderRider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
