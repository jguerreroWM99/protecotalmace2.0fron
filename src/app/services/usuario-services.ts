import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CambioPasswordRequest,
  Rol,
  UsuarioRequest,
  UsuarioResponse
} from '../models/usuario-models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/usuarios';

  listarUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  crearUsuario(request: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.apiUrl, request);
  }

  actualizarUsuario(id: number, request: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.apiUrl}/${id}`, request);
  }

  eliminarUsuario(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }

  cambiarPassword(id: number, request: CambioPasswordRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}/cambiar-password`, request);
  }

  listarRolesDisponibles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles-disponibles`);
  }
}
