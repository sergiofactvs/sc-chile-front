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
import { DonationDto } from '../models/donation.model';
import { DonationService } from '../services/donation.service';
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
  currentAmount: number=0;
  goalAmount: number=0;
  progressPercentage: number=0;
  donationInfo: DonationDto | null = null;
  isLoadingDonation: boolean = true;


  
  constructor(
    private authService: AuthService,
    private playerService: PlayerService,
    private activeTournamentService: ActiveTournamentService,
    private tournamentEnrollmentService: TournamentEnrollmentService,
    private sanitizer: DomSanitizer,
    private donationService: DonationService,
    
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
     // Cargar información de donaciones
     this.loadDonationInfo();
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
  loadDonationInfo(): void {
    this.isLoadingDonation = true;
    console.info('cargando donacion paso 1');
    this.donationService.getDonationInfo().subscribe({
      next: (response) => {
        console.info('cargando donacion paso 2');
        console.info(response);
        if (response.success && response.data) {
          console.info('cargando donacion paso 3');
          this.donationInfo = response.data;
          this.currentAmount = response.data.totalAmount;
          this.goalAmount = response.data.goalAmount;
          this.updateProgressPercentage();
        }
        this.isLoadingDonation = false;
      },
      error: (err) => {
        console.error('Error al cargar información de donaciones:', err);
        this.isLoadingDonation = false;
      }
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
      const element = this.raceDistributionElement.nativeElement;
      
      // Ensure chart container has dimensions
      element.style.width = '100%';
      element.style.height = '300px';
      
      this.raceChart = echarts.init(element);
      
      // Race color mapping
      const raceColorMap: { [key: string]: string } = {
        'Terran': 'rgba(87, 181, 231, 1)',
        'Protoss': 'rgba(141, 211, 199, 1)', 
        'Zerg': 'rgba(251, 191, 114, 1)',
        'Random': 'rgba(170, 170, 170, 1)'
      };
  
      this.activeTournamentService.getRaceDistribution().subscribe({
        next: (distributions) => {
          const chartData = distributions.map(dist => ({
            value: dist.count,
            name: dist.race || 'Desconocida',
            itemStyle: {
              color: raceColorMap[dist.race || 'Random'] || 'rgba(200, 200, 200, 1)'
            }
          }));
  
          const option = {
            animation: false,
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              textStyle: { color: '#1f2937' }
            },
            series: [{
              type: 'pie',
              radius: ['40%', '70%'],
              itemStyle: { borderRadius: 8 },
              label: {
                show: true,
                color: '#fff',
                formatter: '{b}\n{d}%'
              },
              data: chartData.length > 0 ? chartData : [
                { 
                  value: 40, 
                  name: 'Terran', 
                  itemStyle: { color: raceColorMap['Terran'] } 
                },
                { 
                  value: 30, 
                  name: 'Protoss', 
                  itemStyle: { color: raceColorMap['Protoss'] } 
                },
                { 
                  value: 30, 
                  name: 'Zerg', 
                  itemStyle: { color: raceColorMap['Zerg'] } 
                }
              ]
            }]
          };
          
          this.raceChart.setOption(option);
          console.log('Gráfico de razas inicializado con datos del backend');
        },
        error: (error) => {
          console.error('Error al cargar distribución de razas:', error);
          
          // Fallback to predefined data
          const fallbackOption = {
            animation: false,
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              textStyle: { color: '#1f2937' }
            },
            series: [{
              type: 'pie',
              radius: ['40%', '70%'],
              itemStyle: { borderRadius: 8 },
              label: {
                show: true,
                color: '#fff',
                formatter: '{b}\n{d}%'
              },
              data: [
                { 
                  value: 40, 
                  name: 'Terran', 
                  itemStyle: { color: raceColorMap['Terran'] } 
                },
                { 
                  value: 30, 
                  name: 'Protoss', 
                  itemStyle: { color: raceColorMap['Protoss'] } 
                },
                { 
                  value: 30, 
                  name: 'Zerg', 
                  itemStyle: { color: raceColorMap['Zerg'] } 
                }
              ]
            }]
          };
          
          this.raceChart.setOption(fallbackOption);
        }
      });
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