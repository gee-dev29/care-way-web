import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCallIndicator } from './active-call-indicator';

describe('ActiveCallIndicator', () => {
  let component: ActiveCallIndicator;
  let fixture: ComponentFixture<ActiveCallIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveCallIndicator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveCallIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
