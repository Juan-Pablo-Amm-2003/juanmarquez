export interface Task {
  'Id. de tarea': string;
  'Nombre de la tarea': string;
  'Nombre del depósito': string;
  'Progreso': number;
  'Priority': string;
  'Fecha de creación': number | string | Date;
  'Fecha de inicio': number | string | Date;
  'Fecha de vencimiento': number | string | Date;
  'Con retraso': boolean;
}

export interface ProcessedTask {
  id_tarea: string;
  nombre_tarea: string;
  nombre_deposito: string;
  progreso: number;
  priority: string;
  fecha_creacion: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  con_retraso: boolean;
}

export interface ProcessSummary {
  totalRows: number;
  inserted: number;
  updated: number;
  duplicates: number;
  errors: number;
}