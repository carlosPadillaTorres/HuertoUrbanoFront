export interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  contrasenia: string;
  token?: string | null; // Opcional, si se maneja autenticación
  estatus: boolean; // 1 para activo, 0 para inactivo
  rol: string; // CLIE, AMDS, EMPL
}
