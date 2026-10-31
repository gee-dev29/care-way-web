import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FufilCard } from './fufil-card';

describe('FufilCard', () => {
  let component: FufilCard;
  let fixture: ComponentFixture<FufilCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FufilCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FufilCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
