// src/app/landing/landing.component.ts
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player.service';
import { ActiveTournamentService } from '../services/active-tournament.service';
import { TournamentEnrollmentService } from '../services/tournament-enrollment.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { QualifiedPlayersComponent } from '../tournament/qualified-players.component';
import * as echarts from 'echarts';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    QualifiedPlayersComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit {
  @ViewChild('raceDistribution') raceDistributionElement: ElementRef | undefined;
  @ViewChild('weeklyActivity') weeklyActivityElement: ElementRef | undefined;
  @ViewChild('rankingDistribution') rankingDistributionElement: ElementRef | undefined;
  
  private raceChart: any;
  private activityChart: any;
  private rankingChart: any;
  
  isAuthenticated: boolean = false;
  userName: string = '';
  primaryAlias: string = '';
  isLoadingTournament: boolean = true;
  activeTournament: any = null;
  isUserEnrolled: boolean = false;
  mobileMenuOpen: boolean = false;
  
  // Donation progress
  currentAmount: number = 350;
  goalAmount: number = 1000;
  progressPercentage: number = 35;
  
  constructor(
    private authService: AuthService,
    private playerService: PlayerService,
    private activeTournamentService: ActiveTournamentService,
    private tournamentEnrollmentService: TournamentEnrollmentService,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit() {
    // Verificar si el usuario está autenticado
    this.isAuthenticated = !!this.authService.getToken();
    
    // Obtener información del usuario si está autenticado
    if (this.isAuthenticated) {
      this.userName = this.authService.getUserName() || 'Usuario';
      this.loadPlayerAlias();
      this.checkEnrollmentStatus();
    }
    
    // Suscribirse a cambios en el estado de autenticación
    this.authService.isAuthenticated.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.userName = this.authService.getUserName() || 'Usuario';
        this.loadPlayerAlias();
        this.checkEnrollmentStatus();
      } else {
        this.userName = '';
        this.primaryAlias = '';
        this.isUserEnrolled = false;
      }
    });
    
    // Cargar torneo activo
    this.loadActiveTournament();
    
    // Calcular porcentaje de progreso
    this.updateProgressPercentage();
  }
  
  ngAfterViewInit() {
    // Inicializar los gráficos después de que la vista esté lista
    // Aumentamos el retraso para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
      this.initCharts();
    }, 1000);
    
    // Manejar el redimensionamiento de la ventana
    window.addEventListener('resize', () => {
      this.resizeCharts();
    });
  }
  
  // Método para inicializar todos los gráficos
  initCharts() {
    console.log('Inicializando gráficos...');
    
    // Verificar si los elementos existen antes de inicializar
    if (this.raceDistributionElement && this.raceDistributionElement.nativeElement) {
      console.log('Elemento de distribución de razas encontrado, inicializando...');
      this.initRaceDistributionChart();
    } else {
      console.error('Elemento de distribución de razas no encontrado');
    }
    
    if (this.weeklyActivityElement && this.weeklyActivityElement.nativeElement) {
      this.initWeeklyActivityChart();
    }
    
    if (this.rankingDistributionElement && this.rankingDistributionElement.nativeElement) {
      this.initRankingDistributionChart();
    }
  }
  
  // Método para redimensionar todos los gráficos
  resizeCharts() {
    if (this.raceChart) this.raceChart.resize();
    if (this.activityChart) this.activityChart.resize();
    if (this.rankingChart) this.rankingChart.resize();
  }
  
  initRaceDistributionChart() {
    if (this.raceDistributionElement && this.raceDistributionElement.nativeElement) {
      try {
        // Verificar el tamaño del contenedor
        const element = this.raceDistributionElement.nativeElement;
        const width = element.clientWidth;
        const height = element.clientHeight;
        
        console.log(`Tamaño del contenedor de razas: ${width}x${height}`);
        
        // Si el contenedor no tiene tamaño, forzar dimensiones
        if (width === 0 || height === 0) {
          element.style.width = '100%';
          element.style.height = '300px';
          console.log('Ajustando tamaño del contenedor de razas');
        }
        
        // Inicializar el gráfico
        this.raceChart = echarts.init(element);
        
        const option = {
          animation: false,
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            textStyle: { color: '#1f2937' }
          },
          series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            itemStyle: {
              borderRadius: 8
            },
            label: {
              show: true,
              color: '#fff'
            },
            data: [
              { value: 40, name: 'Terran', itemStyle: { color: 'rgba(87, 181, 231, 1)' } },
              { value: 30, name: 'Protoss', itemStyle: { color: 'rgba(141, 211, 199, 1)' } },
              { value: 30, name: 'Zerg', itemStyle: { color: 'rgba(251, 191, 114, 1)' } }
            ]
          }]
        };
        
        this.raceChart.setOption(option);
        console.log('Gráfico de razas inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar el gráfico de distribución de razas:', error);
      }
    }
  }
  
  initWeeklyActivityChart() {
    if (this.weeklyActivityElement) {
      this.activityChart = echarts.init(this.weeklyActivityElement.nativeElement);
      
      const option = {
        animation: false,
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          textStyle: { color: '#1f2937' }
        },
        grid: {
          top: 10,
          right: 10,
          bottom: 20,
          left: 40
        },
        xAxis: {
          type: 'category',
          data: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          axisLine: { lineStyle: { color: '#ffffff20' } },
          axisLabel: { color: '#ffffff80' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#ffffff20' } },
          axisLabel: { color: '#ffffff80' },
          splitLine: { lineStyle: { color: '#ffffff10' } }
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: { color: 'rgba(87, 181, 231, 1)' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(87, 181, 231, 0.2)'
              }, {
                offset: 1,
                color: 'rgba(87, 181, 231, 0)'
              }]
            }
          }
        }]
      };
      
      this.activityChart.setOption(option);
    }
  }
  
  initRankingDistributionChart() {
    if (this.rankingDistributionElement) {
      this.rankingChart = echarts.init(this.rankingDistributionElement.nativeElement);
      
      const option = {
        animation: false,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          textStyle: { color: '#1f2937' }
        },
        series: [{
          type: 'pie',
          radius: '70%',
          itemStyle: {
            borderRadius: 8
          },
          label: {
            show: true,
            color: '#fff'
          },
          data: [
            { value: 30, name: 'S', itemStyle: { color: 'rgba(87, 181, 231, 1)' } },
            { value: 25, name: 'A', itemStyle: { color: 'rgba(141, 211, 199, 1)' } },
            { value: 20, name: 'B', itemStyle: { color: 'rgba(251, 191, 114, 1)' } },
            { value: 15, name: 'C', itemStyle: { color: 'rgba(252, 141, 98, 1)' } }
          ]
        }]
      };
      
      this.rankingChart.setOption(option);
    }
  }
  
  getSafeChallongeUrl(url: string): SafeResourceUrl {
    // Añadir "/module" al final de la URL si no lo tiene ya
    if (url && !url.endsWith('/module')) {
      url = url + '/module?show_tournament_name=1&show_final_results=1&show_standings=1';
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
  loadPlayerAlias() {
    this.playerService.getGameProfiles().subscribe({
      next: (profiles) => {
        if (profiles && profiles.length > 0) {
          // Usar el primer alias como principal
          this.primaryAlias = profiles[0].alias || '';
        }
      },
      error: (err) => {
        console.error('Error al cargar perfiles de juego:', err);
      }
    });
  }
  
  loadActiveTournament() {
    this.isLoadingTournament = true;
    this.activeTournamentService.getActiveTournamentWithPlayers().subscribe({
      next: (tournament) => {
        this.activeTournament = tournament;
        this.isLoadingTournament = false;
      },
      error: (err) => {
        // Si es 404, significa que no hay torneo activo (no es un error)
        if (err.status === 404) {
          this.activeTournament = null;
        } else {
          console.error('Error al cargar torneo activo:', err);
        }
        this.isLoadingTournament = false;
      }
    });
  }
  
  checkEnrollmentStatus() {
    if (!this.isAuthenticated) return;
    
    this.tournamentEnrollmentService.getEnrollmentStatus().subscribe({
      next: (status) => {
        this.isUserEnrolled = status.isEnrolled;
      },
      error: (err) => {
        console.error('Error al verificar estado de inscripción:', err);
      }
    });
  }
  
  updateProgressPercentage() {
    this.progressPercentage = Math.round((this.currentAmount / this.goalAmount) * 100);
  }
  
  logout() {
    this.authService.logout();
    // La suscripción en ngOnInit actualizará la UI
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}