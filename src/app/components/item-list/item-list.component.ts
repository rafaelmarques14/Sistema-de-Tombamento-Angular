import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DataService } from '../../services/data.service';
import { Item } from '../../models/item.model';
import { Funcionario } from '../../models/funcionario.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  displayedColumns: string[] = ['item', 'tombamento', 'status', 'atribuidoPara', 'acoes'];
  itens: Item[] = [];
  funcionarios: Funcionario[] = [];
  funcionarioMap = new Map<number, string>();

  constructor(
    private dataService: DataService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    this.dataService.getFuncionarios().subscribe(data => {
      this.funcionarios = data;
      this.funcionarios.forEach(f => this.funcionarioMap.set(f.id, f.nome));

      
      this.dataService.getItens().subscribe(dataItens => {
        this.itens = [...dataItens]; 
      });
    });
  }

  getFuncionarioNome(id: number | null | undefined): string {
    return id ? this.funcionarioMap.get(id) || 'Não encontrado' : '-';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Livre': return 'status-livre';
      case 'Em uso': return 'status-em-uso';
      case 'Manutenção': return 'status-manutencao';
      default: return '';
    }
  }

  atribuirItem(item: Item): void {
    alert('Funcionalidade de atribuir item (dialog) a ser implementada.');
    
  }

  desatribuirItem(item: Item): void {
    if (confirm(`Tem certeza que deseja desatribuir "${item.nomeDoItem}"?`)) {
      this.dataService.desatribuirItem(item.id);
      this.loadData(); 
    }
  }
}