import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHeight } from './list-height';

describe('ListHeight', () => {
  let component: ListHeight;
  let fixture: ComponentFixture<ListHeight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHeight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHeight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
