export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  genero: string;
  telefono: string;
  correo: string;
  fechaNacimiento: Date;
  direccion: Direccion;
  usuario: Usuario;
}

export interface Usuario {
  nombreUsuario: String;
  estatus: 0 | 1;
  fechaRegistro: Date
}

export interface Direccion {
  calle: string;
  ciudad: string;
  estado: string;
  domicilio: string;
  pais: string;
}

export interface Compra {
  id: string;
  idCliente: string;
  total: number;
  estatus: 1 | 0;
  fechaCompra: Date;
  detallesCompra: detalleCompra[];
}

export interface detalleCompra {
  id: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
}
