import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth-services';
import { UsuarioService } from '../../services/usuario-services';
import { HistorialService } from '../../services/historial-services';
import { HistorialResponse } from '../../models/historial-models';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonToggleModule
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private historialService = inject(HistorialService);
  private cdr = inject(ChangeDetectorRef);

  usuario = this.authService.obtenerUsuarioActual();
  ocultarActual = true;
  ocultarNueva = true;
  guardandoClave = false;

  passwordForm: FormGroup = this.fb.group({
    passwordActual: ['', [Validators.required]],
    passwordNueva: ['', [Validators.required, Validators.minLength(4)]]
  });

  vistaHistorial: 'personal' | 'supervisado' = 'personal';
  historialColumns: string[] = ['fechaHora', 'usuarioNombreCompleto', 'modulo', 'accion', 'detalle'];
  historialDataSource = new MatTableDataSource<HistorialResponse>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cambiarPassword(formDirective: FormGroupDirective): void {
    if (this.passwordForm.invalid || !this.usuario) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.guardandoClave = true;
    this.usuarioService.cambiarPassword(this.usuario.id, this.passwordForm.value).subscribe({
      next: (res) => {
        this.guardandoClave = false;
        formDirective.resetForm();
        this.cdr.detectChanges();

        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        }).fire({ icon: 'success', title: res.mensaje });

        this.cargarHistorial();
      },
      error: (err) => {
        this.guardandoClave = false;
        this.cdr.detectChanges();
        Swal.fire('Error', err.error?.mensaje || 'No se pudo cambiar la contraseña', 'error');
      }
    });
  }

  cargarHistorial(): void {
    if (!this.usuario) return;

    const peticion = this.vistaHistorial === 'supervisado' && !this.authService.esCoordinador()
      ? this.historialService.obtenerHistorialSupervisado()
      : this.historialService.obtenerHistorialPersonal(this.usuario.id);

    peticion.subscribe({
      next: (datos) => {
        this.historialDataSource.data = datos;
        this.historialDataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el historial de movimientos', 'error');
      }
    });
  }

  filtrarHistorial(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.historialDataSource.filter = valor.trim().toLowerCase();
  }
}
