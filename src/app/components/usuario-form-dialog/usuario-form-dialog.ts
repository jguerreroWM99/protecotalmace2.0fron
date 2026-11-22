import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario-services';
import { Rol, UsuarioResponse } from '../../models/usuario-models';

@Component({
  selector: 'app-usuario-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './usuario-form-dialog.html',
  styleUrl: './usuario-form-dialog.css'
})
export class UsuarioFormDialog implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private dialogRef = inject(MatDialogRef<UsuarioFormDialog>);
  data: UsuarioResponse | null = inject(MAT_DIALOG_DATA);

  rolesDisponibles: Rol[] = [];
  ocultarPassword = true;
  guardando = false;

  usuarioForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    documentoIdentidad: ['', [Validators.required, Validators.minLength(8)]],
    fechaNacimiento: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    rolId: [null, [Validators.required]],
    password: [''],
    activo: [true]
  });

  ngOnInit(): void {
    this.cargarRolesDisponibles();

    if (this.data) {
      // Modo edición: contraseña opcional
      this.usuarioForm.patchValue({
        username: this.data.username,
        nombres: this.data.nombres,
        apellidos: this.data.apellidos,
        documentoIdentidad: this.data.documentoIdentidad,
        fechaNacimiento: this.data.fechaNacimiento,
        correo: this.data.correo,
        rolId: this.data.rolId,
        activo: this.data.activo
      });
    } else {
      // Modo creación: contraseña obligatoria
      this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
      this.usuarioForm.get('password')?.updateValueAndValidity();
    }
  }

  cargarRolesDisponibles(): void {
    this.usuarioService.listarRolesDisponibles().subscribe({
      next: (roles) => {
        this.rolesDisponibles = roles;
        // Si solo hay un rol disponible (ej. Supervisor creando Coordinador), preseleccionarlo
        if (!this.data && roles.length === 1) {
          this.usuarioForm.get('rolId')?.setValue(roles[0].id);
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los roles disponibles', 'error');
      }
    });
  }

  guardar(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const payload = { ...this.usuarioForm.value };

    // Si estamos editando y dejaron la contraseña vacía, no enviarla
    if (this.data && (!payload.password || payload.password.trim() === '')) {
      delete payload.password;
    }

    const peticion = this.data
      ? this.usuarioService.actualizarUsuario(this.data.id, payload)
      : this.usuarioService.crearUsuario(payload);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500
        });
        Toast.fire({
          icon: 'success',
          title: this.data ? 'Usuario actualizado' : 'Usuario registrado correctamente'
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.guardando = false;
        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar',
          text: err.error?.mensaje || 'Verifica los datos ingresados'
        });
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
