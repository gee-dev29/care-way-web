import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopInput } from './desktop-input';

describe('DesktopInput', () => {
  let component: DesktopInput;
  let fixture: ComponentFixture<DesktopInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
