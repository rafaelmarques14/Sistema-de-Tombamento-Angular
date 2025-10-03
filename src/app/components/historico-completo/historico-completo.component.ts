import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, map, Observable } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Item } from '../../models/item.model';
import { Funcionario } from '../../models/funcionario.model';
import { Historico } from '../../models/historico.model';

// Importações para o PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface HistoricoFormatado {
  nomeItem: string;
  nomeFuncionario: string;
  dataInicio: string;
  dataFim: string | null;
}

@Component({
  selector: 'app-historico-completo',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './historico-completo.component.html',
  styleUrls: ['./historico-completo.component.scss']
})
export class HistoricoCompletoComponent implements OnInit {
  displayedColumns: string[] = ['item', 'funcionario', 'dataInicio', 'dataFim'];
  historicoCompleto$!: Observable<HistoricoFormatado[]>;
  private rawData: HistoricoFormatado[] = []; 

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.historicoCompleto$ = forkJoin({
      historico: this.dataService.getHistoricoCompleto(),
      itens: this.dataService.fetchAndNotifyItens(),
      funcionarios: this.dataService.getFuncionarios()
    }).pipe(
      map(({ historico, itens, funcionarios }) => {
        const itemMap = new Map(itens.map(i => [i.id, i.nomeDoItem]));
        const funcMap = new Map(funcionarios.map(f => [f.id, f.nome]));

        const formattedData = historico.map(h => ({
          nomeItem: itemMap.get(h.itemId) || 'Item desconhecido',
          nomeFuncionario: funcMap.get(h.funcionarioId) || 'Funcionário desconhecido',
          dataInicio: h.dataInicio,
          dataFim: h.dataFim
        }));
        
        // ✅ SOLUÇÃO: Ordena os registos pela data do evento mais recente.
        // Se 'dataFim' existe, usa-a; senão, usa 'dataInicio'.
        formattedData.sort((a, b) => {
          const dateA = new Date(a.dataFim || a.dataInicio).getTime();
          const dateB = new Date(b.dataFim || b.dataInicio).getTime();
          return dateB - dateA;
        });

        this.rawData = formattedData;
        return formattedData;
      })
    );
  }

  gerarPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(16);
    doc.text('Relatório de Histórico de Atividades - TombaRAS', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 26, { align: 'center' });

    autoTable(doc, {
      startY: 32, 
      head: [['Item', 'Atribuído para', 'Data de Início', 'Data de Devolução']],
      body: this.rawData.map(h => [
        h.nomeItem,
        h.nomeFuncionario,
        new Date(h.dataInicio).toLocaleDateString('pt-BR'),
        h.dataFim ? new Date(h.dataFim).toLocaleDateString('pt-BR') : 'Em uso'
      ]),
      theme: 'grid'
    });

    doc.save('historico-tombaras.pdf');
  }
}

