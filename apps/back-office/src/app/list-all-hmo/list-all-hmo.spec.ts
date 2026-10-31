import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllHmo } from './list-all-hmo';

describe('ListAllHmo', () => {
  let component: ListAllHmo;
  let fixture: ComponentFixture<ListAllHmo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllHmo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllHmo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
