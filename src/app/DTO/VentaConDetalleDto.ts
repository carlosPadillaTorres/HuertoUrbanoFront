import { DetalleVentaDto } from './DetalleVentaDto';

export interface VentaConDetallesDto {
  idVenta: number;
  fechaVenta: string;
  total: number;
  estatus: boolean;
  detalles: DetalleVentaDto[];
}
