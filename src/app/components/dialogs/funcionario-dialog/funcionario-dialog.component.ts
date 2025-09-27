import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Funcionario } from '../../../models/funcionario.model';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-funcionario-dialog',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule],
  providers: [
    provideNativeDateAdapter() 
  ],
  templateUrl: './funcionario-dialog.component.html',
  styleUrl: './funcionario-dialog.component.scss'
})
export class FuncionarioDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialogRef: MatDialogRef<FuncionarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Funcionario | null
  ) {
    this.isEditMode = !!this.data; 
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [this.data?.nome || '', Validators.required],
      cpf: [this.data?.cpf || '', Validators.required],
      dataNascimento: [this.data?.dataNascimento ? new Date(this.data.dataNascimento) : '', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) {
      return; 
    }

    const formData = this.form.value;

    if (this.isEditMode && this.data) {
     
      const updatedFuncionario: Funcionario = { id: this.data.id, ...formData };
      this.dataService.updateFuncionario(updatedFuncionario).subscribe(() => {
        this.dialogRef.close(true); 
      });
    } else {
      
      this.dataService.addFuncionario(formData).subscribe(() => {
        this.dialogRef.close(true); 
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(); 
  }
}






