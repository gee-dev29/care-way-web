import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBloodPressure } from './list-blood-pressure';

describe('ListBloodPressure', () => {
  let component: ListBloodPressure;
  let fixture: ComponentFixture<ListBloodPressure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBloodPressure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBloodPressure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
