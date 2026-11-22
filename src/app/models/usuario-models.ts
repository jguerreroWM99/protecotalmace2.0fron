export interface Rol {
  id: number;
  nombre: string;
  nivelJerarquia: number;
  descripcion?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RecuperarPasswordRequest {
  username: string;
  documentoIdentidad: string;
  fechaNacimiento: string; // Formato YYYY-MM-DD
  correo: string;
  nuevaPassword: string;
}

export interface UsuarioRequest {
  username: string;
  nombres: string;
  apellidos: string;
  documentoIdentidad: string;
  fechaNacimiento: string; // Formato YYYY-MM-DD
  correo: string;
  password?: string;
  activo?: boolean;
  rolId: number;
}

export interface UsuarioResponse {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  documentoIdentidad: string;
  fechaNacimiento: string;
  correo: string;
  activo: boolean;
  fechaCreacion: string;
  rolId: number;
  rolNombre: string;
  nivelJerarquia: number;
}

export interface CambioPasswordRequest {
  passwordActual: string;
  passwordNueva: string;
}
