import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtribuirDialog } from './atribuir-dialog';

describe('AtribuirDialog', () => {
  let component: AtribuirDialog;
  let fixture: ComponentFixture<AtribuirDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtribuirDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtribuirDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
