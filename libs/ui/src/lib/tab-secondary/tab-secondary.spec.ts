import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSecondary } from './tab-secondary';

describe('TabSecondary', () => {
  let component: TabSecondary;
  let fixture: ComponentFixture<TabSecondary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabSecondary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabSecondary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
