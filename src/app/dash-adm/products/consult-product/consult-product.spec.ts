import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultProduct } from './consult-product';

describe('ConsultProduct', () => {
  let component: ConsultProduct;
  let fixture: ComponentFixture<ConsultProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
