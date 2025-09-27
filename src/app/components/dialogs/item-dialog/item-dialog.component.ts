import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { Item } from '../../../models/item.model';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.css']
})
export class ItemDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean;
  statuses: ('Livre' | 'Em uso' | 'Manutenção')[] = ['Livre', 'Em uso', 'Manutenção'];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item | null
  ) {
    this.isEditMode = !!this.data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nomeDoItem: [this.data?.nomeDoItem || '', Validators.required],
      marca: [this.data?.marca || '', Validators.required],
      modelo: [this.data?.modelo || '', Validators.required],
      numeroDeTombamento: [this.data?.numeroDeTombamento || '', Validators.required],
      status: [this.data?.status || 'Livre', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) return;

    if (this.isEditMode && this.data) {
      const updatedItem: Item = { ...this.data, ...this.form.value };
      this.dataService.updateItem(updatedItem).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      const newItem = { ...this.form.value, funcionarioId: null };
      this.dataService.addItem(newItem).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}