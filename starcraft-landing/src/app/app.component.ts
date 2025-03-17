// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AppComponent {
  title = 'Chilean StarCraft';
  subtitle = 'CHAMPIONSHIP - 2025';
  
  // Variables para futuras características
  tournamentDate = '16 Marzo 2025';
  
  // Método para cualquier interacción futura
  onEnterSite() {
    console.log('Entrando al sitio principal');
    // Aquí puedes agregar lógica de navegación si expandes el sitio
  }
}