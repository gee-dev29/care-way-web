import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmoPurchasedList } from './hmo-purchased-list';

describe('HmoPurchasedList', () => {
  let component: HmoPurchasedList;
  let fixture: ComponentFixture<HmoPurchasedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmoPurchasedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmoPurchasedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
