import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router'; // Para redirigir después del registro exitoso
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // Inicializamos la propiedad con un valor por defecto (en este caso, un FormGroup vacío)
  registerForm: FormGroup = new FormGroup({});

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      telefono: new FormControl('', [
        Validators.required, 
        Validators.pattern('^\\d{10}$')
      ])
    });
  }

  // Lógica de la función de registro
  funRegistrar() {
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, revisa los campos e intenta nuevamente.',
      });
      return;
    }

    const registerData = this.registerForm.value;
    this.authService.registroConNest(registerData).subscribe(
      (response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: response.message || 'Tu cuenta ha sido creada correctamente.',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/auth/login']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: response.message || 'Algo salió mal. Intenta nuevamente.',
          });
        }
      },
      (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'Ocurrió un error en el servidor. Por favor, intenta nuevamente más tarde.',
        });
      }
    );
  }
}

