import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAds } from './add-ads';

describe('AddAds', () => {
  let component: AddAds;
  let fixture: ComponentFixture<AddAds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
