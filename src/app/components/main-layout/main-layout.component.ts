import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  navLinks = [
    { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: 'itens', label: 'Itens', icon: 'list_alt' },
    { path: 'funcionarios', label: 'Funcionários', icon: 'people' }
  ];

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}