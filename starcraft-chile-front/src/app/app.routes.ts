// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { NewLandingComponent } from './landing/new-landing.component';
import { CurrentSeasonRankingComponent } from './current-season-ranking/current-season-ranking.component';
import { AuthComponent } from './auth/auth.component';
import { PlayerProfileComponent } from './player/player-profile.component';
import { TournamentEnrollmentComponent } from './tournament/tournament-enrollment.component';
import { ActiveTournamentComponent } from './tournament/active-tournament.component';
import { adminRoutes } from './admin/admin.routes';
import { AuthGuard } from './guards/auth.guard';
import { PlayerPublicProfileComponent } from './player/player-public-profile.component';
import { QualifiedPlayersComponent } from './tournament/qualified-players.component';
import { CommunityRankingComponent } from './community-ranking/community-ranking.component';

export const routes: Routes = [
  ...adminRoutes,
  {
    path: 'community-ranking', 
    component: CommunityRankingComponent
  },
  { 
    path: 'bew', 
    component: NewLandingComponent // Cambiamos al nuevo componente de landing
  },
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
    path: 'profile',
    component: PlayerProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'enroll',
    component: TournamentEnrollmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'active-tournament',
    component: ActiveTournamentComponent
  },
  {
    path: 'player/:id',
    component: PlayerPublicProfileComponent
  },
  {
    path: 'qualified-players',
    component: QualifiedPlayersComponent
  },
  {
    path: '**', 
    redirectTo: ''
  }
];