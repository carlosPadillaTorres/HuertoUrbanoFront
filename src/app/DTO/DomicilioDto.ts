import { Ciudad } from "../Models/CiudadModel";

export interface DomicilioUpdateDto { // Para actualizar un proveedor
  idDomicilio: Number,
  calle: String,
  numero: string | number,
  colonia: String,
  codigoPostal: String,
  idCiudad: Number,
  ciudad?: Ciudad | null
}

