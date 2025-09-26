import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioDialog } from './funcionario-dialog';

describe('FuncionarioDialog', () => {
  let component: FuncionarioDialog;
  let fixture: ComponentFixture<FuncionarioDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
