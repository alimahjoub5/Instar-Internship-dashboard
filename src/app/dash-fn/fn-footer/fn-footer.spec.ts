import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FnFooter } from './fn-footer';

describe('FnFooter', () => {
  let component: FnFooter;
  let fixture: ComponentFixture<FnFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FnFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FnFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
