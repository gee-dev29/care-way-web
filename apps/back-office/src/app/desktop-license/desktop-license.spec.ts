import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopLicense } from './desktop-license';

describe('DesktopLicense', () => {
  let component: DesktopLicense;
  let fixture: ComponentFixture<DesktopLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
