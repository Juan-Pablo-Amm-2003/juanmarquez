export interface Task {
  'Id. de tarea': string;
  'Nombre de la tarea': string;
  'Nombre del depósito': string;
  'Progreso': string;
  'Priority': string;
  'Asignado a': string;
  'Creado por': string;
  'Fecha de creación': number | string | Date;
  'Fecha de inicio': number | string | Date;
  'Fecha de vencimiento': number | string | Date;
  'Es periódica': string | boolean;
  'Con retraso': string | boolean;
  'Fecha de finalización': number | string | Date;
  'Completado por': string;
  'Elementos de la lista de comprobación completados': number | string;
  'Elementos de la lista de comprobación': number | string;
  'Etiquetas': string;
  'Descripción': string;
}

export interface ProcessedTask {
  id_tarea: string;
  nombre_tarea: string;
  nombre_deposito: string;
  progreso: string;
  priority: string;
  asignado_a: string;
  creado_por: string;
  fecha_creacion: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  es_periodica: boolean;
  con_retraso: boolean;
  fecha_finalizacion: string | null;
  completado_por: string;
  checklist_completados: number;
  checklist_total: number;
  etiquetas: string;
  descripcion: string;
}

export interface ProcessSummary {
  totalRows: number;
  inserted: number;
  updated: number;
  duplicates: number;
  errors: number;
}