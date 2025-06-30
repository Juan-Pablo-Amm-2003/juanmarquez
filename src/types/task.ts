export interface ExcelTask {
  'Id. de tarea': string | number | null;
  'Nombre de la tarea'?: string | null;
  'Nombre del depósito'?: string | null;
  Progreso?: number | null;
  Priority?: string | null;
  'Asignado a'?: string | null;
  'Creado por'?: string | null;
  'Fecha de creación'?: any;
  'Fecha de inicio'?: any;
  'Fecha de vencimiento'?: any;
  'Es periódica'?: any;
  'Con retraso'?: any;
  'Fecha de finalización'?: any;
  'Completado por'?: string | null;
  'Elementos de la lista de comprobación completados'?: number | null;
  'Elementos de la lista de comprobación'?: number | null;
  Etiquetas?: string | null;
  Descripción?: string | null;
}

export interface SupabaseTask {
  id_tarea: string;
  nombre_tarea: string | null;
  nombre_deposito: string | null;
  progreso: number | null;
  priority: string | null;
  asignado_a: string | null;
  creado_por: string | null;
  fecha_creacion: string | null;
  fecha_inicio: string | null;
  fecha_vencimiento: string | null;
  es_periodica: boolean | null;
  con_retraso: boolean | null;
  fecha_finalizacion: string | null;
  completado_por: string | null;
  checklist_completados: number | null;
  checklist_total: number | null;
  etiquetas: string | null;
  descripcion: string | null;
}

export interface ProcessSummary {
  totalRows: number;
  processed: number;
  upserted: number;
  errors: number;
}
