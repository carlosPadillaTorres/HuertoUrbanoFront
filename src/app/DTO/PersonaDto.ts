import { DomicilioUpdateDto } from "./DomicilioDto";

export interface RegistroPersonaDto {
    apPaterno: string;
    apMaterno: string;
    nombre: string;
    fechaNacimiento: Date;
    email: string;
    telefono: string;
    genero: string;
    idDomicilio: number;
    domicilio: DomicilioUpdateDto;
  }
