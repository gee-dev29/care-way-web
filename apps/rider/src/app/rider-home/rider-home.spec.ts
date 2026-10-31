import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderHome } from './rider-home';

describe('RiderHome', () => {
  let component: RiderHome;
  let fixture: ComponentFixture<RiderHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
