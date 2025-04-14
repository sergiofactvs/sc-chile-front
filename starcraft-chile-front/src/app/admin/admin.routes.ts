// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { TournamentListComponent } from './tournaments/tournament-list.component';
import { TournamentEditComponent } from './tournaments/tournament-edit.component';
import { TournamentBracketComponent } from './tournaments/tournament-bracket/tournament-bracket.component'; // Añadir esta línea
import { UserListComponent } from './users/user-list.component';
import { AdminGuard } from '../guards/admin.guard';

export const adminRoutes: Routes = [
  { 
    path: 'admin/login', 
    component: AdminLoginComponent 
  },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/tournaments',
    component: TournamentListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/tournaments/new', 
    component: TournamentEditComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/tournaments/edit/:id', 
    component: TournamentEditComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/tournaments/:id/bracket', // Añadir esta ruta
    component: TournamentBracketComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/users',
    component: UserListComponent,
    canActivate: [AdminGuard]
  }
];