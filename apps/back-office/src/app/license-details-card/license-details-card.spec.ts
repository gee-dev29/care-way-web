import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseDetailsCard } from './license-details-card';

describe('LicenseDetailsCard', () => {
  let component: LicenseDetailsCard;
  let fixture: ComponentFixture<LicenseDetailsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseDetailsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseDetailsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
