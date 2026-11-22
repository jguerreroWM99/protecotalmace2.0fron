import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, Marca, Modelo, TipoProducto } from '../models/catalogo-models';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/catalogos';

  // Categorías
  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  crearCategoria(dto: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/categorias`, dto);
  }

  actualizarCategoria(id: number, dto: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/categorias/${id}`, dto);
  }

  eliminarCategoria(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/categorias/${id}`);
  }

  // Tipos de Producto
  listarTiposProducto(): Observable<TipoProducto[]> {
    return this.http.get<TipoProducto[]>(`${this.apiUrl}/tipos`);
  }

  listarTiposPorCategoria(categoriaId: number): Observable<TipoProducto[]> {
    return this.http.get<TipoProducto[]>(`${this.apiUrl}/tipos/categoria/${categoriaId}`);
  }

  crearTipoProducto(dto: TipoProducto): Observable<TipoProducto> {
    return this.http.post<TipoProducto>(`${this.apiUrl}/tipos`, dto);
  }

  actualizarTipoProducto(id: number, dto: TipoProducto): Observable<TipoProducto> {
    return this.http.put<TipoProducto>(`${this.apiUrl}/tipos/${id}`, dto);
  }

  eliminarTipoProducto(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/tipos/${id}`);
  }

  // Marcas
  listarMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/marcas`);
  }

  crearMarca(dto: Marca): Observable<Marca> {
    return this.http.post<Marca>(`${this.apiUrl}/marcas`, dto);
  }

  actualizarMarca(id: number, dto: Marca): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/marcas/${id}`, dto);
  }

  eliminarMarca(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/marcas/${id}`);
  }

  // Modelos
  listarModelos(): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(`${this.apiUrl}/modelos`);
  }

  listarModelosPorMarca(marcaId: number): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(`${this.apiUrl}/modelos/marca/${marcaId}`);
  }

  crearModelo(dto: Modelo): Observable<Modelo> {
    return this.http.post<Modelo>(`${this.apiUrl}/modelos`, dto);
  }

  actualizarModelo(id: number, dto: Modelo): Observable<Modelo> {
    return this.http.put<Modelo>(`${this.apiUrl}/modelos/${id}`, dto);
  }

  eliminarModelo(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/modelos/${id}`);
  }
}
