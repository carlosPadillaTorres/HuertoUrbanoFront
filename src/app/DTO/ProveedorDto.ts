import { DomicilioUpdateDto } from "./DomicilioDto";


export interface UpdateProveedorDto{
  idProveedor: Number,
  empresa: String,
  fechaRegistro: Date | string,
  fechaTermino: Date | string | null,
  estatus: Boolean,
  telefono: String,
  email: String,
  rfc: String,
  domicilio: DomicilioUpdateDto

}


export interface CreateProveedorDto{
  empresa: String,
  telefono: String,
  email: String,
  rfc: String,
  domicilio: DomicilioUpdateDto

}
