import { Routes } from '@angular/router';
// 1. Importe os componentes que você quer associar a uma rota
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ItemListComponent } from './components/item-list/item-list.component';

export const routes: Routes = [

    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 

    { path: 'dashboard', component: DashboardComponent }, 
    
    { path: 'itens', component: ItemListComponent }
];