import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderSignup } from './rider-signup';

describe('RiderSignup', () => {
  let component: RiderSignup;
  let fixture: ComponentFixture<RiderSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
