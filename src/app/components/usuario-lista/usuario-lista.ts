import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth-services';
import { UsuarioService } from '../../services/usuario-services';
import { UsuarioResponse } from '../../models/usuario-models';
import { UsuarioFormDialog } from '../usuario-form-dialog/usuario-form-dialog';

@Component({
  selector: 'app-usuario-lista',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './usuario-lista.html',
  styleUrl: './usuario-lista.css'
})
export class UsuarioLista implements OnInit {
  authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);

  usuarioActualId = this.authService.obtenerUsuarioId();
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<UsuarioResponse>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    // Solo el Administrador ve la columna de acciones (Editar / Eliminar)
    this.displayedColumns = this.authService.esAdmin()
      ? ['username', 'nombreCompleto', 'documentoIdentidad', 'correo', 'rolNombre', 'activo', 'acciones']
      : ['username', 'nombreCompleto', 'documentoIdentidad', 'correo', 'rolNombre', 'activo'];

    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.dataSource.data = usuarios;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar la lista de usuarios', 'error');
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  abrirFormulario(usuario?: UsuarioResponse): void {
    const dialogRef = this.dialog.open(UsuarioFormDialog, {
      width: '620px',
      data: usuario || null
    });

    dialogRef.afterClosed().subscribe((guardado) => {
      if (guardado) {
        this.cargarUsuarios();
      }
    });
  }

  eliminarUsuario(usuario: UsuarioResponse): void {
    Swal.fire({
      title: '¿Eliminar usuario?',
      html: `Se eliminará permanentemente a <b>${usuario.nombres} ${usuario.apellidos}</b> (@${usuario.username})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario.id).subscribe({
          next: (res) => {
            Swal.fire('Eliminado', res.mensaje, 'success');
            this.cargarUsuarios();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.mensaje || 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }
}
