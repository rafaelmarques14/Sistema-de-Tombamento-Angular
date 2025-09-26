import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { FuncionarioListComponent } from "./components/funcionario-list/funcionario-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatToolbarModule,
    MatIconModule, MatTabsModule, DashboardComponent, ItemListComponent, FuncionarioListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sistema-tombamento');
}

