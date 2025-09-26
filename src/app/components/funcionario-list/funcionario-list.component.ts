import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { Funcionario } from '../../models/funcionario.model';
import { FuncionarioDialogComponent } from '../dialogs/funcionario-dialog/funcionario-dialog.component';

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FuncionarioDialogComponent
  ],
  templateUrl: './funcionario-list.component.html',
  styleUrls: ['./funcionario-list.component.scss']
})
export class FuncionarioListComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'cpf', 'dataNascimento', 'acoes'];
  funcionarios: Funcionario[] = [];

  constructor(
    private dataService: DataService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios(): void {
    this.dataService.getFuncionarios().subscribe(data => {
      this.funcionarios = data;
    });
  }

  openDialog(funcionario?: Funcionario): void {
    
    const dialogRef = this.dialog.open(FuncionarioDialogComponent, {
      width: '400px',
      data: funcionario ? { ...funcionario } : null 
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if (result) {
        this.loadFuncionarios();
      }
    });
    
  }

  deleteFuncionario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.dataService.deleteFuncionario(id).subscribe(() => {
        this.loadFuncionarios(); 
      });
    }
  }
}