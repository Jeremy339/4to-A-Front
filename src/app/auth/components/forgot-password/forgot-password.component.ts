import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Asegúrate de que esta ruta sea correcta
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;  // Usa el operador '!' para indicar que la propiedad se inicializa en ngOnInit()

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;

    if (email && typeof email === 'string') {
      this.authService.forgotPassword(email).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Enlace de restablecimiento enviado a tu correo.',
          });
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el enlace, por favor revisa el correo.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa un correo electrónico válido.',
      });
    }
  }
}
