export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
}

export interface TipoProducto {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoriaId: number;
  categoriaNombre?: string;
}

export interface Marca {
  id?: number;
  nombre: string;
}

export interface Modelo {
  id?: number;
  nombre: string;
  marcaId: number;
  marcaNombre?: string;
}
