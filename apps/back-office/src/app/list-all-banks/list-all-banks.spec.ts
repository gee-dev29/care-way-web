import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllBanks } from './list-all-banks';

describe('ListAllBanks', () => {
  let component: ListAllBanks;
  let fixture: ComponentFixture<ListAllBanks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllBanks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllBanks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
