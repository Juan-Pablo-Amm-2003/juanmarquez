export interface Task {
  'Id. de tarea': string;
  'Nombre de la tarea': string;
  'Nombre del depósito': string;
  'Progreso': number;
  'Priority': string;
  'Fecha de creación': string | number | Date; // xlsx reads dates as numbers or strings
  'Fecha de inicio': string | number | Date;
  'Fecha de vencimiento': string | number | Date;
  'Con retraso': boolean;
}

export interface ProcessedTask {
  id_tarea: string;
  nombre_tarea: string;
  nombre_deposito: string;
  progreso: number;
  priority: string;
  fecha_creacion: string; // ISO string
  fecha_inicio: string; // ISO string
  fecha_vencimiento: string; // ISO string
  con_retraso: boolean;
}

export interface ProcessSummary {
  totalRows: number;
  inserted: number;
  updated: number;
  duplicates: number;
  errors: number;
}
