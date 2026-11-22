import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialResponse } from '../models/historial-models';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/historial';

  obtenerHistorialPersonal(usuarioId: number): Observable<HistorialResponse[]> {
    return this.http.get<HistorialResponse[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  obtenerHistorialSupervisado(): Observable<HistorialResponse[]> {
    return this.http.get<HistorialResponse[]>(`${this.apiUrl}/supervisado`);
  }
}
