import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashAdmComponent } from './dash-adm';

describe('DashAdm', () => {
  let component: DashAdmComponent;
  let fixture: ComponentFixture<DashAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashAdmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
