import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const { newPassword, confirmPassword } = this.resetPasswordForm.value;
    if (this.resetPasswordForm.valid && newPassword === confirmPassword) {
      this.authService.resetPassword(this.token || '', newPassword).subscribe(
        () => {
          Swal.fire('Éxito', 'Contraseña restablecida correctamente', 'success');
          this.router.navigate(['/auth/login']);
        },
        () => {
          Swal.fire('Error', 'No se pudo restablecer la contraseña', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Las contraseñas no coinciden o el formulario es inválido', 'error');
    }
  }
}
