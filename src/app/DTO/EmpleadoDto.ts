import { Usuario } from "../Models/UsuarioModel";
import { RegistroPersonaDto } from "./PersonaDto";

export interface CreateEmpleadoDto {
  idEmpleado: number;
  puesto: string;
  curp: string;
  rfc: string;
  salarioBruto: number;
  fechaIngreso: Date;
  fechaRenuncia?: Date;
  persona: RegistroPersonaDto; // Propiedades anidadas
  usuario?: Usuario;
}
