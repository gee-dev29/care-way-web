import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsHomePage } from './vitals-home-page';

describe('VitalsHomePage', () => {
  let component: VitalsHomePage;
  let fixture: ComponentFixture<VitalsHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsHomePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitalsHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
