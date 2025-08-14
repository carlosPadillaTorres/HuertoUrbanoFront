import { Domicilio } from "./DomicilioModel";

export interface Persona {
    idPersona: number;
    apPaterno: string;
    apMaterno: string;
    nombre: string;
    fechaNacimiento: string; // ISO string
    email: string;
    telefono: string;
    genero: string;
    idDomicilio: number;
    domicilio: Domicilio;
  }
