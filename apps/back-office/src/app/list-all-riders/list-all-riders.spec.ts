import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllRiders } from './list-all-riders';

describe('ListAllRiders', () => {
  let component: ListAllRiders;
  let fixture: ComponentFixture<ListAllRiders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllRiders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllRiders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
