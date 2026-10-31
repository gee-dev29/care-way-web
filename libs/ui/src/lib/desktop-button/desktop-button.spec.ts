import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopButton } from './desktop-button';

describe('DesktopButton', () => {
  let component: DesktopButton;
  let fixture: ComponentFixture<DesktopButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
