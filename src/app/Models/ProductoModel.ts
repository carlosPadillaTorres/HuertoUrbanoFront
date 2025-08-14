import { Proveedor } from "./ProveedorModel";

export interface Producto {
  idProducto: number;              // IdProducto (PK)
  nombreProducto: string;          // [Required, StringLength(100)]
  marca: string;                    // [Required, StringLength(30)]
  tipo: string;                     // [Required, StringLength(3)] - KIT, ACT, SEN, OTR, PLA
  cantidadTotal: number;            // int
  costoUnidad: number;              // decimal
  descripcion: string;              // required
  idProveedor: number;              // required
  proveedor?: Proveedor;            // FK opcional
  estatus: boolean;                 // required
}
