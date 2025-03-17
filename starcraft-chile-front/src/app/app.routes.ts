import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { CurrentSeasonRankingComponent } from './current-season-ranking/current-season-ranking.component';
import { AuthComponent } from './auth/auth.component';
import { adminRoutes } from './admin/admin.routes';
export const routes: Routes = [
  ...adminRoutes,
  { 
    path: '', 
    component: LandingComponent 
  },
  {
    path: 'currentseason', 
    component: CurrentSeasonRankingComponent
  },
  {
    path: 'auth', 
    component: AuthComponent
  },
  {
    path: '**', 
    redirectTo: ''
  }
];