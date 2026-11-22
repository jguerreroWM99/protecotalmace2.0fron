import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

import { CatalogoService } from '../../services/catalogo-services';
import { Categoria, Marca, Modelo, TipoProducto } from '../../models/catalogo-models';

@Component({
  selector: 'app-catalogo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './catalogo-dialog.html',
  styleUrl: './catalogo-dialog.css'
})
export class CatalogoDialog implements OnInit {
  private fb = inject(FormBuilder);
  private catalogoService = inject(CatalogoService);
  private dialogRef = inject(MatDialogRef<CatalogoDialog>);
  private cdr = inject(ChangeDetectorRef);

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
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.catalogoService.listarCategorias().subscribe(res => {
      this.categorias = res;
      this.cdr.detectChanges();
    });
    this.catalogoService.listarTiposProducto().subscribe(res => {
      this.tiposProducto = res;
      this.cdr.detectChanges();
    });
    this.catalogoService.listarMarcas().subscribe(res => {
      this.marcas = res;
      this.cdr.detectChanges();
    });
    this.catalogoService.listarModelos().subscribe(res => {
      this.modelos = res;
      this.cdr.detectChanges();
    });
  }

  agregarCategoria(formDirective: FormGroupDirective): void {
    if (this.categoriaForm.invalid) return;
    this.catalogoService.crearCategoria(this.categoriaForm.value).subscribe({
      next: () => {
        formDirective.resetForm();
        this.cargarCatalogos();
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
        this.mostrarToast('Categoría eliminada');
      },
      error: (err) => Swal.fire('No permitido', err.error?.mensaje || 'No se puede eliminar', 'warning')
    });
  }

  agregarTipo(formDirective: FormGroupDirective): void {
    if (this.tipoForm.invalid) return;
    this.catalogoService.crearTipoProducto(this.tipoForm.value).subscribe({
      next: () => {
        formDirective.resetForm();
        this.cargarCatalogos();
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
        this.mostrarToast('Tipo eliminado');
      },
      error: (err) => Swal.fire('No permitido', err.error?.mensaje || 'No se puede eliminar', 'warning')
    });
  }

  agregarMarca(formDirective: FormGroupDirective): void {
    if (this.marcaForm.invalid) return;
    this.catalogoService.crearMarca(this.marcaForm.value).subscribe({
      next: () => {
        formDirective.resetForm();
        this.cargarCatalogos();
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
        this.mostrarToast('Marca eliminada');
      },
      error: (err) => Swal.fire('No permitido', err.error?.mensaje || 'No se puede eliminar', 'warning')
    });
  }

  agregarModelo(formDirective: FormGroupDirective): void {
    if (this.modeloForm.invalid) return;
    this.catalogoService.crearModelo(this.modeloForm.value).subscribe({
      next: () => {
        formDirective.resetForm();
        this.cargarCatalogos();
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
        this.mostrarToast('Modelo eliminado');
      },
      error: (err) => Swal.fire('No permitido', err.error?.mensaje || 'No se puede eliminar', 'warning')
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  private mostrarToast(titulo: string): void {
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    }).fire({ icon: 'success', title: titulo });
  }
}
