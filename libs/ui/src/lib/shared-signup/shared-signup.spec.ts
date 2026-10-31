import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSignup } from './shared-signup';

describe('SharedSignup', () => {
  let component: SharedSignup;
  let fixture: ComponentFixture<SharedSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
