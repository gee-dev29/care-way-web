import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardType } from './card-type';

describe('CardType', () => {
  let component: CardType;
  let fixture: ComponentFixture<CardType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
