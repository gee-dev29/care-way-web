import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllLaboratories } from './list-all-laboratories';

describe('ListAllLaboratories', () => {
  let component: ListAllLaboratories;
  let fixture: ComponentFixture<ListAllLaboratories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllLaboratories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllLaboratories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
