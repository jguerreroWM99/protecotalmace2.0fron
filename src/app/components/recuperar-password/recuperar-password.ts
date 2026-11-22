import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth-services';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css'
})
export class RecuperarPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ocultarPassword = true;
  cargando = false;

  recuperarForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    documentoIdentidad: ['', [Validators.required, Validators.minLength(8)]],
    fechaNacimiento: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    nuevaPassword: ['', [Validators.required, Validators.minLength(4)]]
  });

  restablecer(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.authService.recuperarPassword(this.recuperarForm.value).subscribe({
      next: (res) => {
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: '¡Contraseña actualizada!',
          text: res.mensaje,
          confirmButtonColor: '#3f51b5'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        this.cargando = false;
        const mensaje = err.error?.mensaje || 'Los datos ingresados no coinciden';
        Swal.fire({
          icon: 'error',
          title: 'Error de verificación',
          text: mensaje,
          confirmButtonColor: '#3f51b5'
        });
      }
    });
  }
}
