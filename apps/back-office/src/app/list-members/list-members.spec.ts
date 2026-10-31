import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMembers } from './list-members';

describe('ListMembers', () => {
  let component: ListMembers;
  let fixture: ComponentFixture<ListMembers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMembers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMembers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
