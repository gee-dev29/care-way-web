import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllInvites } from './list-all-invites';

describe('ListAllInvites', () => {
  let component: ListAllInvites;
  let fixture: ComponentFixture<ListAllInvites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllInvites]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllInvites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
