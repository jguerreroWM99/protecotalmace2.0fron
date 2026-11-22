export interface ProductoRequest {
  codigoSku: string;
  nombre: string;
  especificaciones?: string;
  precio: number;
  stock: number;
  tipoProductoId: number;
  modeloId: number;
}

export interface ProductoResponse {
  id: number;
  codigoSku: string;
  nombre: string;
  especificaciones?: string;
  precio: number;
  stock: number;
  fechaRegistro: string;
  fechaActualizacion: string;
  tipoProductoId: number;
  tipoProductoNombre: string;
  categoriaId: number;
  categoriaNombre: string;
  modeloId: number;
  modeloNombre: string;
  marcaId: number;
  marcaNombre: string;
}
