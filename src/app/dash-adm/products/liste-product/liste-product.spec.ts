import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeProduct } from './liste-product';

describe('ListeProduct', () => {
  let component: ListeProduct;
  let fixture: ComponentFixture<ListeProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
