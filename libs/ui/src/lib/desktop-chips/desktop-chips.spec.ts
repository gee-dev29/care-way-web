import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopChips } from './desktop-chips';

describe('DesktopChips', () => {
  let component: DesktopChips;
  let fixture: ComponentFixture<DesktopChips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopChips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopChips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
