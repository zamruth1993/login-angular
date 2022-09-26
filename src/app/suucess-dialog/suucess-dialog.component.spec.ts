import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuucessDialogComponent } from './suucess-dialog.component';

describe('SuucessDialogComponent', () => {
  let component: SuucessDialogComponent;
  let fixture: ComponentFixture<SuucessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuucessDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuucessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
