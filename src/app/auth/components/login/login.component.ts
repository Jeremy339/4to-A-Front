import { Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';  // Importamos isPlatformBrowser

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variable para manejar el estado del checkbox "Recuérdame"
  rememberMe: boolean = false;

  // Formulario reactivo para email y password
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false)  // Control para "Recuérdame"
  });

  // Variable para manejar el estado de carga
  isLoading: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Solo ejecutar esto en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedEmail = localStorage.getItem('email') ?? '';  // Si es null o undefined, usar un string vacío
      const savedPassword = localStorage.getItem('password') ?? '';  // Lo mismo para la contraseña

      // Verificar si se tiene email y password guardados
      if (savedEmail && savedPassword) {
        this.rememberMe = true;
        this.loginForm.setValue({
          email: savedEmail,  // Asignar el valor del email si no es null
          password: savedPassword,  // Asignar la contraseña si no es null
          rememberMe: true  // Establecer el estado del checkbox como verdadero
        });
      }
    }
  }

  funIngresar() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    const email = this.loginForm.value.email ?? '';  // Asignar un valor vacío si es null o undefined
    const password = this.loginForm.value.password ?? '';  // Lo mismo para la contraseña

    // Llamada al servicio de autenticación
    this.authService.loginConNest({ email, password }).subscribe(
      (res) => {
        this.isLoading = false;

        if (res && res.token) {
          // Asegurarse de que localStorage solo se use en el navegador
          if (isPlatformBrowser(this.platformId)) {
            // Si "Recuérdame" está marcado, guardar las credenciales en localStorage
            if (this.rememberMe) {
              localStorage.setItem('authToken', res.token);
              localStorage.setItem('email', email);  // Guardar el email
              localStorage.setItem('password', password);  // Guardar la contraseña
            } else {
              sessionStorage.setItem('authToken', res.token);
            }
          }

          // Mostrar mensaje de éxito y redirigir al dashboard
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Bienvenido al sistema.',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/admin']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: 'Por favor, verifica tu correo y contraseña.',
          });
        }
      },
      (error) => {
        this.isLoading = false;
        console.error(error);
        Swal.fire({
          icon: 'warning',
          title: 'Credenciales inválidas',
          text: 'Revisa tus datos e inténtalo nuevamente.',
          footer: '<a href="/auth/forgot-password">¿Olvidaste tu contraseña?</a>'
        });
      }
    );
  }
}
