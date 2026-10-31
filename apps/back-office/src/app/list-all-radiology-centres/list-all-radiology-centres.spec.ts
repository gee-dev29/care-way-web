import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllRadiologyCentres } from './list-all-radiology-centres';

describe('ListAllRadiologyCentres', () => {
  let component: ListAllRadiologyCentres;
  let fixture: ComponentFixture<ListAllRadiologyCentres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllRadiologyCentres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllRadiologyCentres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
