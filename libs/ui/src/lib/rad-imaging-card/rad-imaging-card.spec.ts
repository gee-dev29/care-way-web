import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadImagingCard } from './rad-imaging-card';

describe('RadImagingCard', () => {
  let component: RadImagingCard;
  let fixture: ComponentFixture<RadImagingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadImagingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadImagingCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
