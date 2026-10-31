import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWeight } from './list-weight';

describe('ListWeight', () => {
  let component: ListWeight;
  let fixture: ComponentFixture<ListWeight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListWeight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListWeight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
