import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RecuperarPasswordRequest, UsuarioResponse } from '../models/usuario-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';
  private readonly STORAGE_KEY = 'almacen_usuario_sesion';

  login(request: LoginRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(usuario => this.guardarSesion(usuario))
    );
  }

  recuperarPassword(request: RecuperarPasswordRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/recuperar-password`, request);
  }

  guardarSesion(usuario: UsuarioResponse): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }

  obtenerUsuarioActual(): UsuarioResponse | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? (JSON.parse(data) as UsuarioResponse) : null;
  }

  obtenerUsuarioId(): number | null {
    const usuario = this.obtenerUsuarioActual();
    return usuario ? usuario.id : null;
  }

  estaAutenticado(): boolean {
    return this.obtenerUsuarioActual() !== null;
  }

  esAdmin(): boolean {
    return this.obtenerUsuarioActual()?.nivelJerarquia === 1;
  }

  esSupervisor(): boolean {
    return this.obtenerUsuarioActual()?.nivelJerarquia === 2;
  }

  esCoordinador(): boolean {
    return this.obtenerUsuarioActual()?.nivelJerarquia === 3;
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
