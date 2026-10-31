import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmLicense } from './pharm-license';

describe('PharmLicense', () => {
  let component: PharmLicense;
  let fixture: ComponentFixture<PharmLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
