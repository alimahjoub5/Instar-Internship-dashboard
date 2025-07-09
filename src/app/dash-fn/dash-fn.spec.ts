import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashFn } from './dash-fn';

describe('DashFn', () => {
  let component: DashFn;
  let fixture: ComponentFixture<DashFn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashFn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashFn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
