import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareOrderLink } from './share-order-link';

describe('ShareOrderLink', () => {
  let component: ShareOrderLink;
  let fixture: ComponentFixture<ShareOrderLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareOrderLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareOrderLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
