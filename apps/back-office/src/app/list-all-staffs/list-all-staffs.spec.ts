import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllStaffs } from './list-all-staffs';

describe('ListAllStaffs', () => {
  let component: ListAllStaffs;
  let fixture: ComponentFixture<ListAllStaffs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllStaffs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllStaffs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
