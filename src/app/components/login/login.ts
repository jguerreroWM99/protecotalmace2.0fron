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
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ocultarPassword = true;
  cargando = false;

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (usuario) => {
        this.cargando = false;
        this.router.navigate(['/app/productos']).then(() => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3500,
            timerProgressBar: true
          });

          Toast.fire({
            icon: 'success',
            title: `¡Bienvenido, ${usuario.nombres} ${usuario.apellidos}!`,
            text: `Rol activo: ${usuario.rolNombre}`
          });
        });
      },
      error: (err) => {
        this.cargando = false;
        const mensaje = err.error?.mensaje || 'No se pudo conectar con el servidor';
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: mensaje,
          confirmButtonColor: '#3f51b5'
        });
      }
    });
  }
}
