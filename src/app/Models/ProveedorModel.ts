import { Domicilio } from "./DomicilioModel";

export interface Proveedor{
  idProveedor: Number,
  empresa: String,
  fechaRegistro: Date | string,
  fechaTermino: Date | string | null,
  estatus: Boolean,
  telefono: String,
  email: String,
  rfc: String,
  domicilio: Domicilio

}
