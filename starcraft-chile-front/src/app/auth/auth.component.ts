import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="container">
     <div class="login-section">
        <button 
          mat-raised-button 
          class="login-button"
          [routerLink]="['/']"
        >
          Volver al Inicio
        </button>
      </div>
      <!-- Logo -->
      <img 
        src="/assets/logo.png" 
        alt="Chilean StarCraft Championship Logo" 
        class="logo"
      >
      
      <!-- Título -->
      <h1 class="title">Chilean StarCraft</h1>
      <p class="subtitle">CHAMPIONSHIP</p>
      
      <!-- Formulario de Autenticación -->
      <div class="card">
        <!-- Pestañas de Login/Registro -->
        <div class="tabs">
          <button 
            (click)="currentTab = 'login'"
            [class.active]="currentTab === 'login'"
          >
            Iniciar Sesión
          </button>
          <button 
            (click)="currentTab = 'register'"
            [class.active]="currentTab === 'register'"
          >
            Registrarse
          </button>
        </div>

        <!-- Formulario de Login -->
        <form 
          *ngIf="currentTab === 'login'" 
          [formGroup]="loginForm" 
          (ngSubmit)="onLogin()"
          class="auth-form"
        >
          <input 
            type="email" 
            formControlName="email" 
            placeholder="Correo Electrónico"
            required
          >
          <input 
            type="password" 
            formControlName="password" 
            placeholder="Contraseña"
            required
          >
          <button 
            type="submit" 
            class="enter-button"
            [disabled]="loginForm.invalid"
          >
            ENTRAR
          </button>
          <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
        </form>

        <!-- Formulario de Registro -->
        <form 
          *ngIf="currentTab === 'register'" 
          [formGroup]="registrationForm" 
          (ngSubmit)="onRegister()"
          class="auth-form"
        >
          <div class="name-group">
            <input 
              type="text" 
              formControlName="firstName" 
              placeholder="Nombre"
              required
            >
            <input 
              type="text" 
              formControlName="lastName" 
              placeholder="Apellido"
              required
            >
          </div>
          <input 
            type="email" 
            formControlName="email" 
            placeholder="Correo Electrónico"
            required
          >
          <input 
            type="text" 
            formControlName="alias" 
            placeholder="Alias de Jugador"
            required
          >
          <input 
            type="password" 
            formControlName="password" 
            placeholder="Contraseña"
            required
          >
          <input 
            type="password" 
            formControlName="confirmPassword" 
            placeholder="Confirmar Contraseña"
            required
          >
          <button 
            type="submit" 
            class="enter-button"
            [disabled]="registrationForm.invalid"
          >
            REGISTRARSE
          </button>
        </form>
      </div>
      
      <!-- Footer -->
      <footer class="footer">
        © 2025 Chilean StarCraft Championship
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #000000;
      color: white;
      font-family: 'Roboto', sans-serif;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px 20px;
      box-sizing: border-box;
      text-align: center;
    }

    .logo {
      width: auto;
      height: 350px;
      margin-top: 40px;
      margin-bottom: 40px;
    }

    .title {
      font-family: 'Orbitron', sans-serif;
      font-size: 3.5rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0 0 10px 0;
    }

    .subtitle {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 6px;
      margin: 10px 0 40px 0;
    }

    .card {
      text-align: center;
      padding: 30px;
      border-radius: 8px;
      background-color: rgba(10, 10, 20, 0.7);
      border-left: 3px solid #d52b1e;
      max-width: 500px;
      width: 100%;
    }

    .tabs {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .tabs button {
      background: none;
      border: none;
      color: #aaa;
      font-size: 1rem;
      margin: 0 15px;
      padding-bottom: 10px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .tabs button.active {
      color: white;
      border-bottom-color: #d52b1e;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .name-group {
      display: flex;
      gap: 15px;
    }

    input {
      width: 100%;
      padding: 12px;
      background-color: rgba(30, 30, 50, 0.5);
      border: none;
      color: white;
      font-size: 1rem;
    }

    .enter-button {
      background-color: #d52b1e;
      color: white;
      border: none;
      padding: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 10px;
      cursor: pointer;
    }

    .forgot-password {
      color: #aaa;
      text-decoration: none;
      margin-top: 10px;
      font-size: 0.9rem;
    }

    .footer {
      margin-top: auto;
      padding: 20px;
      color: #666;
      font-size: 0.9rem;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .logo {
        height: 250px;
      }
      
      .title {
        font-size: 2.5rem;
      }
      
      .subtitle {
        font-size: 1.2rem;
        letter-spacing: 4px;
      }

      .name-group {
        flex-direction: column;
        gap: 15px;
      }
    }

    @media (max-width: 480px) {
      .logo {
        height: 180px;
      }
      
      .title {
        font-size: 1.8rem;
      }
      
      .subtitle {
        font-size: 1rem;
        letter-spacing: 2px;
      }
    }
    .login-section {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
    }

    .login-button {
      background-color: #D52B1E !important;
      color: white !important;
      font-weight: bold;
      text-transform: uppercase;
      border: none;
      padding: 8px 16px;
    }

    .container {
      position: relative; // Añadir para posicionamiento absoluto del botón
    }


  `]
})
export class AuthComponent {
  loginForm: FormGroup;
  registrationForm: FormGroup;
  currentTab: 'login' | 'register' = 'login';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registrationForm = this.fb.group({
      firstName: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100)
      ]],
      lastName: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100)
      ]],
      email: ['', [Validators.required, Validators.email]],
      alias: ['', [Validators.required]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(100)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value 
      ? null 
      : { passwordMismatch: true };
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Login:', this.loginForm.value);
      // Implementar lógica de login
      this.router.navigate(['/']);
    }
  }

  onRegister() {
    if (this.registrationForm.valid) {
      console.log('Registro:', this.registrationForm.value);
      // Implementar lógica de registro
      this.router.navigate(['/']);
    }
  }
}