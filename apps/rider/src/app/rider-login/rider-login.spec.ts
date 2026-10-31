import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderLogin } from './rider-login';

describe('RiderLogin', () => {
  let component: RiderLogin;
  let fixture: ComponentFixture<RiderLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
