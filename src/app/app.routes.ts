import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

// Guarda de rota funcional para proteger o acesso
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true; // Permite o acesso se o utilizador estiver autenticado
  }
  // Se não estiver autenticado, redireciona para a página de login
  return router.parseUrl('/login');
};

export const routes: Routes = [
  {
    path: 'login',
    // Carregamento dinâmico (lazy loading) do componente de login
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'app',
    // Carregamento dinâmico do layout principal
    loadComponent: () => import('./components/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard], // Protege esta rota e as suas filhas
    children: [
      // As suas páginas agora são "filhas" do layout principal
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'itens', loadComponent: () => import('./components/item-list/item-list.component').then(m => m.ItemListComponent) },
      { path: 'funcionarios', loadComponent: () => import('./components/funcionario-list/funcionario-list.component').then(m => m.FuncionarioListComponent) },
      // ✅ NOVA ROTA ADICIONADA PARA A PÁGINA DE HISTÓRICO
      { path: 'historico', loadComponent: () => import('./components/historico-completo/historico-completo.component').then(m => m.HistoricoCompletoComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Rota padrão dentro de /app
    ]
  },
  // Rotas de fallback para redirecionar o utilizador
  { path: '', redirectTo: '/app', pathMatch: 'full' },
  { path: '**', redirectTo: '/app' }
];

