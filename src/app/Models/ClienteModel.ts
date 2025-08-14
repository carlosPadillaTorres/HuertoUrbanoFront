import { DomicilioUpdateDto } from "../DTO/DomicilioDto"
import { Domicilio } from "./DomicilioModel"
import { Usuario } from "./UsuarioModel"

export interface Cliente {
  idCliente: 0,
    idPersona: 0,
    persona: {
      idPersona: 0,
      apPaterno: '',
      apMaterno: '',
      nombre:'',
      fechaNacimiento: '',
      email: '',
      telefono: '',
      genero: '',
      idDomicilio: 0,
      domicilio: DomicilioUpdateDto
    },
    idUsuario: 0,
    usuario: Usuario
  }
