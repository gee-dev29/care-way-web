import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenBookTable } from './green-book-table';

describe('GreenBookTable', () => {
  let component: GreenBookTable;
  let fixture: ComponentFixture<GreenBookTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenBookTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenBookTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
