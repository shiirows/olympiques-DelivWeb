import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPaysComponent } from './detail-pays.component';

describe('DetailPaysComponent', () => {
  let component: DetailPaysComponent;
  let fixture: ComponentFixture<DetailPaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
