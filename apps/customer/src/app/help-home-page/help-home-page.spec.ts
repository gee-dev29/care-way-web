import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpHomePage } from './help-home-page';

describe('HelpHomePage', () => {
  let component: HelpHomePage;
  let fixture: ComponentFixture<HelpHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpHomePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
