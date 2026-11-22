import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth-services';
import { UsuarioService } from '../../services/usuario-services';
import { HistorialService } from '../../services/historial-services';
import { CatalogoService } from '../../services/catalogo-services';
import { HistorialResponse } from '../../models/historial-models';
import { Categoria, Marca, Modelo, TipoProducto } from '../../models/catalogo-models';

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
    MatSelectModule,
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
  private catalogoService = inject(CatalogoService);

  usuario = this.authService.obtenerUsuarioActual();
  ocultarActual = true;
  ocultarNueva = true;
  guardandoClave = false;

  // Formulario Cambio de Contraseña
  passwordForm: FormGroup = this.fb.group({
    passwordActual: ['', [Validators.required]],
    passwordNueva: ['', [Validators.required, Validators.minLength(4)]]
  });

  // Historial
  vistaHistorial: 'personal' | 'supervisado' = 'personal';
  historialColumns: string[] = ['fechaHora', 'usuarioNombreCompleto', 'modulo', 'accion', 'detalle'];
  historialDataSource = new MatTableDataSource<HistorialResponse>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Catálogos
  categorias: Categoria[] = [];
  tiposProducto: TipoProducto[] = [];
  marcas: Marca[] = [];
  modelos: Modelo[] = [];

  categoriaForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  tipoForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    categoriaId: [null, Validators.required]
  });

  marcaForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required]
  });

  modeloForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    marcaId: [null, Validators.required]
  });

  ngOnInit(): void {
    this.cargarHistorial();
    this.cargarCatalogos();
  }

  // --- SEGURIDAD: CAMBIO DE CONTRASEÑA ---
  cambiarPassword(): void {
    if (this.passwordForm.invalid || !this.usuario) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.guardandoClave = true;
    this.usuarioService.cambiarPassword(this.usuario.id, this.passwordForm.value).subscribe({
      next: (res) => {
        this.guardandoClave = false;
        this.passwordForm.reset();
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({ icon: 'success', title: res.mensaje });
        this.cargarHistorial();
      },
      error: (err) => {
        this.guardandoClave = false;
        Swal.fire('Error', err.error?.mensaje || 'No se pudo cambiar la contraseña', 'error');
      }
    });
  }

  // --- AUDITORÍA: HISTORIAL ---
  cargarHistorial(): void {
    if (!this.usuario) return;

    const peticion = this.vistaHistorial === 'supervisado' && !this.authService.esCoordinador()
      ? this.historialService.obtenerHistorialSupervisado()
      : this.historialService.obtenerHistorialPersonal(this.usuario.id);

    peticion.subscribe({
      next: (datos) => {
        this.historialDataSource.data = datos;
        this.historialDataSource.paginator = this.paginator;
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

  // --- CATÁLOGOS ---
  cargarCatalogos(): void {
    this.catalogoService.listarCategorias().subscribe(res => (this.categorias = res));
    this.catalogoService.listarTiposProducto().subscribe(res => (this.tiposProducto = res));
    this.catalogoService.listarMarcas().subscribe(res => (this.marcas = res));
    this.catalogoService.listarModelos().subscribe(res => (this.modelos = res));
  }

  agregarCategoria(): void {
    if (this.categoriaForm.invalid) return;
    this.catalogoService.crearCategoria(this.categoriaForm.value).subscribe({
      next: () => {
        this.categoriaForm.reset();
        this.cargarCatalogos();
        this.cargarHistorial();
        this.mostrarToast('Categoría agregada');
      },
      error: (err) => Swal.fire('Error', err.error?.mensaje || 'Error al crear categoría', 'error')
    });
  }

  eliminarCategoria(id?: number): void {
    if (!id) return;
    this.catalogoService.eliminarCategoria(id).subscribe({
      next: () => {
        this.cargarCatalogos();
        this.cargarHistorial();
        this.mostrarToast('Categoría eliminada');
      },
      error: (err) => Swal.fire('No permitido', err.error?.mensaje || 'No se puede eliminar', 'warning')
    });
  }

  agregarTipo(): void {
    if (this.tipoForm.invalid) return;
    this.catalogoService.crearTipoProducto(this.tipoForm.value).subscribe({
      next: () => {
        this.tipoForm.reset();
        this.cargarCatalogos();
        this.cargarHistorial();
        this.mostrarToast('Tipo de producto agregado');
      },
      error: (err) => Swal.fire('Error', err.error?.mensaje || 'Error al crear tipo', 'error')
    });
  }

  eliminarTipo(id?: number): void {
    if (!id) return;
    this.catalogoService.eliminarTipoProducto(id).subscribe({
      next: () => {
        this.cargarCatalogos();
        this.cargarHistorial();
        this.mostrarToast('Tipo eliminado');
      },
      error: (err) => Swal.fire('No permitido', err.error?.mensaje || 'No se puede eliminar', 'warning')
    });
  }

  agregarMarca(): void {
    if (this.marcaForm.invalid) return;
    this.catalogoService.crearMarca(this.marcaForm.value).subscribe({
      next: () => {
        this.marcaForm.reset();
        this.cargarCatalogos();
        this.cargarHistorial();
        this.mostrarToast('Marca agregada');
      },
      error: (err) => Swal.fire('Error', err.error?.mensaje || 'Error al crear marca', 'error')
    });
  }

  eliminarMarca(id?: number): void {
    if (!id) return;
    this.catalogoService.eliminarMarca(id).subscribe({
      next: () => {
        this.cargarCatalogos();
        this.cargarHistorial();
        this.mostrarToast('Marca eliminada');
      },
      error: (err) => Swal.fire('No permitido', err.error?.mensaje || 'No se puede eliminar', 'warning')
    });
  }

  agregarModelo(): void {
    if (this.modeloForm.invalid) return;
    this.catalogoService.crearModelo(this.modeloForm.value).subscribe({
      next: () => {
        this.modeloForm.reset();
        this.cargarCatalogos();
        this.cargarHistorial();
        this.mostrarToast('Modelo agregado');
      },
      error: (err) => Swal.fire('Error', err.error?.mensaje || 'Error al crear modelo', 'error')
    });
  }

  eliminarModelo(id?: number): void {
    if (!id) return;
    this.catalogoService.eliminarModelo(id).subscribe({
      next: () => {
        this.cargarCatalogos();
        this.cargarHistorial();
        this.mostrarToast('Modelo eliminado');
      },
      error: (err) => Swal.fire('No permitido', err.error?.mensaje || 'No se puede eliminar', 'warning')
    });
  }

  private mostrarToast(titulo: string): void {
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2200
    }).fire({ icon: 'success', title: titulo });
  }
}
