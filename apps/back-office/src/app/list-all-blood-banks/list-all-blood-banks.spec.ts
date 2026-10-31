import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllBloodBanks } from './list-all-blood-banks';

describe('ListAllBloodBanks', () => {
  let component: ListAllBloodBanks;
  let fixture: ComponentFixture<ListAllBloodBanks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllBloodBanks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllBloodBanks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
