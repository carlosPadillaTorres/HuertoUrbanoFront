import { Persona } from "./PersonaModel";
import { Usuario } from "./UsuarioModel";

export interface Empleado {
  idEmpleado: number;
  puesto: string;
  curp: string;
  rfc: string;
  salarioBruto: number;
  fechaIngreso: string;
  fechaRenuncia?: string; // RE-AÑADIDO: Propiedad fechaRenuncia para el modal de "Ver" y lógica de estado.
  idPersona: number;
  idUsuario: number;
  persona?: Persona; // Propiedades anidadas
  usuario?: Usuario; // Propiedades anidadas
}
