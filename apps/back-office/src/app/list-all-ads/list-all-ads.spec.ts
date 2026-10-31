import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllAds } from './list-all-ads';

describe('ListAllAds', () => {
  let component: ListAllAds;
  let fixture: ComponentFixture<ListAllAds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllAds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllAds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
