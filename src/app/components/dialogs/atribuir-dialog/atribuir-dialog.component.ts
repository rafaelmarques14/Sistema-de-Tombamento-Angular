import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Funcionario } from '../../../models/funcionario.model';
import { Item } from '../../../models/item.model';

@Component({
  selector: 'app-atribuir-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './atribuir-dialog.component.html'
})
export class AtribuirDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AtribuirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Item, funcionarios: Funcionario[] }
  ) {
    this.form = this.fb.group({
      funcionarioId: ['', Validators.required]
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.funcionarioId);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}