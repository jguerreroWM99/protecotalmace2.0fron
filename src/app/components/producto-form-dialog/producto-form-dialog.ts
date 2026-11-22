import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

import { CatalogoService } from '../../services/catalogo-services';
import { ProductoService } from '../../services/producto-services';
import { Categoria, Marca, Modelo, TipoProducto } from '../../models/catalogo-models';
import { ProductoResponse } from '../../models/producto-models';

@Component({
  selector: 'app-producto-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './producto-form-dialog.html',
  styleUrl: './producto-form-dialog.css'
})
export class ProductoFormDialog implements OnInit {
  private fb = inject(FormBuilder);
  private catalogoService = inject(CatalogoService);
  private productoService = inject(ProductoService);
  private dialogRef = inject(MatDialogRef<ProductoFormDialog>);
  data: ProductoResponse | null = inject(MAT_DIALOG_DATA);

  categorias: Categoria[] = [];
  tiposProducto: TipoProducto[] = [];
  marcas: Marca[] = [];
  modelos: Modelo[] = [];
  guardando = false;

  productoForm: FormGroup = this.fb.group({
    codigoSku: [{ value: 'Automático (Ej. TEC-011)', disabled: true }],
    nombre: ['', [Validators.required]],
    especificaciones: [''],
    precio: [null, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoriaId: [null, [Validators.required]],
    tipoProductoId: [null, [Validators.required]],
    marcaId: [null, [Validators.required]],
    modeloId: [null, [Validators.required]]
  });

  ngOnInit(): void {
    this.cargarCatalogosBase();

    if (this.data) {
      this.productoForm.patchValue({
        codigoSku: this.data.codigoSku,
        nombre: this.data.nombre,
        especificaciones: this.data.especificaciones,
        precio: this.data.precio,
        stock: this.data.stock,
        categoriaId: this.data.categoriaId,
        tipoProductoId: this.data.tipoProductoId,
        marcaId: this.data.marcaId,
        modeloId: this.data.modeloId
      });
      this.onCategoriaChange(this.data.categoriaId, false);
      this.onMarcaChange(this.data.marcaId, false);
    }
  }

  cargarCatalogosBase(): void {
    this.catalogoService.listarCategorias().subscribe(res => (this.categorias = res));
    this.catalogoService.listarMarcas().subscribe(res => (this.marcas = res));
  }

  onCategoriaChange(categoriaId: number, limpiarTipo = true): void {
    if (limpiarTipo) {
      this.productoForm.get('tipoProductoId')?.setValue(null);
    }
    if (categoriaId) {
      this.catalogoService.listarTiposPorCategoria(categoriaId).subscribe(res => (this.tiposProducto = res));
    } else {
      this.tiposProducto = [];
    }
  }

  onMarcaChange(marcaId: number, limpiarModelo = true): void {
    if (limpiarModelo) {
      this.productoForm.get('modeloId')?.setValue(null);
    }
    if (marcaId) {
      this.catalogoService.listarModelosPorMarca(marcaId).subscribe(res => (this.modelos = res));
    } else {
      this.modelos = [];
    }
  }

  guardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const { categoriaId, marcaId, codigoSku, ...payload } = this.productoForm.getRawValue();

    const peticion = this.data
      ? this.productoService.actualizarProducto(this.data.id, payload)
      : this.productoService.crearProducto(payload);

    peticion.subscribe({
      next: (res) => {
        this.guardando = false;
        Swal.fire({
          icon: 'success',
          title: this.data
            ? 'Producto actualizado'
            : `Producto registrado (${res.codigoSku})`,
          timer: 1800,
          showConfirmButton: false
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.guardando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: err.error?.mensaje || 'No se pudo procesar la solicitud'
        });
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
