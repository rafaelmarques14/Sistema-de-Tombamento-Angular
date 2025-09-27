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
import { ItemDialogComponent } from '../dialogs/item-dialog/item-dialog.component';
import { AtribuirDialogComponent } from '../dialogs/atribuir-dialog/atribuir-dialog.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
    ItemDialogComponent,
    AtribuirDialogComponent
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
    
    this.dataService.getItensState().subscribe(dataItens => {
      this.itens = dataItens;
    });

   
    this.dataService.getFuncionarios().subscribe(data => {
      this.funcionarios = data;
      this.funcionarios.forEach(f => this.funcionarioMap.set(f.id, f.nome));
    });
  }
  
  openItemDialog(item?: Item): void {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '450px',
      data: item ? { ...item } : null
    });

 
    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        console.log('Diálogo de item fechado com sucesso.');
      }
    });
  }

  deleteItem(item: Item): void {
    if (confirm(`Tem certeza que deseja excluir o item "${item.nomeDoItem}"?`)) {
      this.dataService.deleteItem(item.id).subscribe();
    }
  }
  
  atribuirItem(item: Item): void {
    const dialogRef = this.dialog.open(AtribuirDialogComponent, {
      width: '400px',
      data: { item: item, funcionarios: this.funcionarios }
    });

    dialogRef.afterClosed().subscribe(funcionarioId => {
      if (funcionarioId) {
        this.dataService.atribuirItem(item.id, funcionarioId).subscribe();
      }
    });
  }

  desatribuirItem(item: Item): void {
    if (confirm(`Tem certeza que deseja desatribuir "${item.nomeDoItem}"?`)) {
      this.dataService.desatribuirItem(item.id).subscribe();
    }
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
}