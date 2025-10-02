import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCompleto } from './historico-completo.component';

describe('HistoricoCompleto', () => {
  let component: HistoricoCompleto;
  let fixture: ComponentFixture<HistoricoCompleto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoCompleto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoCompleto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
