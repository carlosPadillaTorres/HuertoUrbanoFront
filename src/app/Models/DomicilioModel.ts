import { Ciudad } from "./CiudadModel";

export interface Domicilio {
  idDomicilio: Number,
  calle: String,
  numero: Number,
  codigoPostal: String,
  colonia: String,
  idCiudad: Number,
  ciudad: Ciudad
}
