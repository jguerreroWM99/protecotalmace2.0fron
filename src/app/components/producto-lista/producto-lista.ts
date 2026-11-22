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

import { ProductoService } from '../../services/producto-services';
import { ProductoResponse } from '../../models/producto-models';
import { ProductoFormDialog } from '../producto-form-dialog/producto-form-dialog';

@Component({
  selector: 'app-producto-lista',
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
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.css'
})
export class ProductoLista implements OnInit {
  private productoService = inject(ProductoService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'codigoSku',
    'nombre',
    'categoriaNombre',
    'marcaModelo',
    'precio',
    'stock',
    'acciones'
  ];
  dataSource = new MatTableDataSource<ProductoResponse>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.listarProductos().subscribe({
      next: (productos) => {
        this.dataSource.data = productos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el inventario de productos', 'error');
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  abrirFormulario(producto?: ProductoResponse): void {
    const dialogRef = this.dialog.open(ProductoFormDialog, {
      width: '620px',
      data: producto || null
    });

    dialogRef.afterClosed().subscribe((guardado) => {
      if (guardado) {
        this.cargarProductos();
      }
    });
  }

  eliminarProducto(producto: ProductoResponse): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      html: `Se eliminará <b>${producto.nombre}</b> (SKU: ${producto.codigoSku})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(producto.id).subscribe({
          next: (res) => {
            Swal.fire('Eliminado', res.mensaje, 'success');
            this.cargarProductos();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.mensaje || 'No se pudo eliminar el producto', 'error');
          }
        });
      }
    });
  }
}
