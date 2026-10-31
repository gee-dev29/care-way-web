import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLicense } from './shared-license';

describe('SharedLicense', () => {
  let component: SharedLicense;
  let fixture: ComponentFixture<SharedLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
