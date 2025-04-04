// Actualización del AuthComponent (src/app/auth/auth.component.ts)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { MatButtonModule } from '@angular/material/button';
import { AuthService, UserRegistrationRequest } from '../services/auth.service';

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
        alt="Comunidad Starcraft CHILE Logo" 
        class="logo"
      >
      
      <!-- Título -->
      <h1 class="title">Comunidad Starcraft</h1>
      <p class="subtitle">CHILE</p>
      
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
          <div class="form-group">
            <label for="login-email">Correo Electrónico</label>
            <input 
              id="login-email"
              type="email" 
              formControlName="email" 
              placeholder="Ingresa tu correo electrónico"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="login-password">Contraseña</label>
            <input 
              id="login-password"
              type="password" 
              formControlName="password" 
              placeholder="Ingresa tu contraseña"
              required
            >
          </div>
          
          <button 
            type="submit" 
            class="enter-button"
            [disabled]="loginForm.invalid || isLoading"
          >
            {{ isLoading ? 'CARGANDO...' : 'ENTRAR' }}
          </button>
          
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
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
            <div class="form-group">
              <label for="register-firstName">Nombre</label>
              <input 
                id="register-firstName"
                type="text" 
                formControlName="firstName" 
                placeholder="Ingresa tu nombre"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="register-lastName">Apellido</label>
              <input 
                id="register-lastName"
                type="text" 
                formControlName="lastName" 
                placeholder="Ingresa tu apellido"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="register-email">Correo Electrónico</label>
            <input 
              id="register-email"
              type="email" 
              formControlName="email" 
              placeholder="Ingresa tu correo electrónico"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="register-alias">Alias de Jugador</label>
            <input 
              id="register-alias"
              type="text" 
              formControlName="alias" 
              placeholder="Ingresa tu alias en el juego"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="register-country">País</label>
            <select 
              id="register-country" 
              formControlName="country"
              required
            >
              <option value="Chile">Chile</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="register-gateway">Gateway (Servidor de juego)</label>
            <select 
              id="register-gateway" 
              formControlName="gateway"
              required
            >
              <option [ngValue]="null" disabled>Selecciona un servidor</option>
              <option [ngValue]="30">Korea</option>
              <option [ngValue]="45">Asia</option>
              <option [ngValue]="11">U.S. East</option>
              <option [ngValue]="10">U.S. West</option>
              <option [ngValue]="20">Europe</option>
            </select>
          </div>
          
         
          
          <div class="form-group">
            <label for="register-description">Descripción (opcional)</label>
            <textarea 
              id="register-description"
              formControlName="description" 
              placeholder="Cuéntanos sobre ti (opcional)"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="register-password">Contraseña</label>
            <input 
              id="register-password"
              type="password" 
              formControlName="password" 
              placeholder="Mínimo 8 caracteres"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="register-confirmPassword">Confirmar Contraseña</label>
            <input 
              id="register-confirmPassword"
              type="password" 
              formControlName="confirmPassword" 
              placeholder="Repite tu contraseña"
              required
            >
          </div>
          
          <div *ngIf="registrationForm.errors?.['passwordMismatch'] && registrationForm.get('confirmPassword')?.touched" class="error-message">
            Las contraseñas no coinciden
          </div>
          
          <button 
            type="submit" 
            class="enter-button"
            [disabled]="registrationForm.invalid || isLoading"
          >
            {{ isLoading ? 'CARGANDO...' : 'REGISTRARSE' }}
          </button>
          
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
      
      <!-- Footer -->
      <footer class="footer">
        © 2025 Comunidad Starcraft CHILE
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
      height: 450px;
      margin-top: 5px;
      margin-bottom: 5px;
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

    .form-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }

    .form-group label {
      color: #aaa;
      font-size: 0.9rem;
      text-align: left;
    }

    .name-group {
      display: flex;
      gap: 15px;
    }

    .name-group .form-group {
      flex: 1;
    }

    input, select, textarea {
      width: 100%;
      padding: 12px;
      background-color: rgba(30, 30, 50, 0.5);
      border: none;
      color: white;
      font-size: 1rem;
      box-sizing: border-box;
    }

    input[type="date"] {
      padding: 10px 12px;
    }

    select {
      appearance: none;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="6"><path d="M0 0l6 6 6-6z" fill="%23ffffff"/></svg>');
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 30px;
      cursor: pointer;
    }

    option {
      background-color: #1a1a2e;
      color: white;
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

    .enter-button:disabled {
      background-color: #666;
      cursor: not-allowed;
    }

    .forgot-password {
      color: #aaa;
      text-decoration: none;
      margin-top: 10px;
      font-size: 0.9rem;
    }

    .error-message {
      color: #ff6b6b;
      font-size: 0.9rem;
      margin-top: 10px;
      width: 100%;
      text-align: center;
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
      position: relative; /* Añadir para posicionamiento absoluto del botón */
    }
  `]
})
export class AuthComponent {
  loginForm: FormGroup;
  registrationForm: FormGroup;
  currentTab: 'login' | 'register' = 'login';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
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
      country: ['Chile', [Validators.required]], // Valor por defecto "Chile"
      description: [''],
      gateway: [null, [Validators.required]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(100)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Obtener valores del formulario
      const credentials = this.loginForm.value;
      
      // Llamar al servicio de autenticación
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirigir según el rol del usuario
          const userRole = this.authService.getUserRole();
          
          if (userRole === 'Admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/profile']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error de login:', err);
          
          // Manejar diferentes tipos de errores
          if (err.status === 401) {
            this.errorMessage = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
          } else if (err.status === 403) {
            this.errorMessage = 'Cuenta desactivada o sin confirmar. Contacta al administrador.';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo más tarde.';
          }
        }
      });
    }
  }

  onRegister() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Preparar datos para el registro según la estructura requerida por la API
      const formValues = this.registrationForm.value;
      
       
      
      const registrationData: UserRegistrationRequest = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,        
        country: formValues.country,
        description: formValues.description || undefined,
        email: formValues.email,
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
        alias: formValues.alias,
        gateway: formValues.gateway,
        // El playerId es opcional y generalmente no se envía en el registro inicial
      };
      
      // Enviar solicitud de registro a la API
      this.authService.register(registrationData).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.success) {
            // Mostrar mensaje de éxito y redirigir o cambiar a la pestaña de login
            alert('Registro exitoso! Te hemos enviado un correo para confirmar tu cuenta.');
            this.currentTab = 'login'; // Cambiar a la pestaña de login después del registro
            this.registrationForm.reset(); // Limpiar formulario
            this.registrationForm.patchValue({ country: 'Chile' }); // Restablecer el valor por defecto de país
          } else {
            // Manejar respuesta de éxito pero con algún problema
            this.errorMessage = response.message || 'No se pudo completar el registro. Intenta de nuevo.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error de registro:', err);
          
          if (err.status === 400) {
            // Validación fallida
            this.errorMessage = 'Por favor, verifica los datos ingresados. ' + (err.error?.detail || '');
          } else {
            this.errorMessage = 'Error al registrarse. Intenta de nuevo más tarde.';
          }
        }
      });
    }
  }
}