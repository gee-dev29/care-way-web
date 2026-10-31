import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHighlight } from './page-highlight';

describe('PageHighlight', () => {
  let component: PageHighlight;
  let fixture: ComponentFixture<PageHighlight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHighlight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageHighlight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
