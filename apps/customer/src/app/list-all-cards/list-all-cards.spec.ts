import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllCards } from './list-all-cards';

describe('ListAllCards', () => {
  let component: ListAllCards;
  let fixture: ComponentFixture<ListAllCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
