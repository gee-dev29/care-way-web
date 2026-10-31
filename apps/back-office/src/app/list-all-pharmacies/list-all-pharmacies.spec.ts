import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllPharmacies } from './list-all-pharmacies';

describe('ListAllPharmacies', () => {
  let component: ListAllPharmacies;
  let fixture: ComponentFixture<ListAllPharmacies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllPharmacies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllPharmacies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
