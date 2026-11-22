import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoRequest, ProductoResponse } from '../models/producto-models';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/productos';

  listarProductos(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/${id}`);
  }

  crearProducto(request: ProductoRequest): Observable<ProductoResponse> {
    return this.http.post<ProductoResponse>(this.apiUrl, request);
  }

  actualizarProducto(id: number, request: ProductoRequest): Observable<ProductoResponse> {
    return this.http.put<ProductoResponse>(`${this.apiUrl}/${id}`, request);
  }

  eliminarProducto(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}
