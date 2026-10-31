import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllAgents } from './list-all-agents';

describe('ListAllAgents', () => {
  let component: ListAllAgents;
  let fixture: ComponentFixture<ListAllAgents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllAgents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllAgents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
