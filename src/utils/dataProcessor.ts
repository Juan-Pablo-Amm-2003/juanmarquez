import { supabase } from '../lib/supabaseClient';
import { ExcelTask, SupabaseTask, ProcessSummary } from '../types/task';
import { excelDateToISOString } from './excelParser';

const toBoolean = (value: any): boolean | null => {
  if (value === null || typeof value === 'undefined' || value === '') return null;
  const lowerValue = String(value).toLowerCase().trim();
  if (['true', 'verdadero', '1', 'yes', 'si'].includes(lowerValue)) return true;
  if (['false', 'falso', '0', 'no'].includes(lowerValue)) return false;
  return null;
};

const toNull = <T>(value: T | undefined | null | ''): T | null => {
    return value === undefined || value === null || value === '' ? null : value;
};

export const transformAndValidateTasks = (excelTasks: ExcelTask[]): SupabaseTask[] => {
  console.log(`[Processor] Iniciando transformación de ${excelTasks.length} tareas.`);
  
  const transformedTasks = excelTasks
    .map((task, index) => {
      if (!task['Id. de tarea']) {
        console.warn(`[Processor] Fila ${index + 2} omitida: 'Id. de tarea' está vacío.`);
        return null;
      }

      const supabaseTask: SupabaseTask = {
        id_tarea: String(task['Id. de tarea']),
        nombre_tarea: toNull(task['Nombre de la tarea']),
        nombre_deposito: toNull(task['Nombre del depósito']),
        progreso: typeof task.Progreso === 'number' ? task.Progreso : null,
        priority: toNull(task.Priority),
        asignado_a: toNull(task['Asignado a']),
        creado_por: toNull(task['Creado por']),
        fecha_creacion: excelDateToISOString(task['Fecha de creación']),
        fecha_inicio: excelDateToISOString(task['Fecha de inicio']),
        fecha_vencimiento: excelDateToISOString(task['Fecha de vencimiento']),
        es_periodica: toBoolean(task['Es periódica']),
        con_retraso: toBoolean(task['Con retraso']),
        fecha_finalizacion: excelDateToISOString(task['Fecha de finalización']),
        completado_por: toNull(task['Completado por']),
        checklist_completados: toNull(task['Elementos de la lista de comprobación completados']),
        checklist_total: toNull(task['Elementos de la lista de comprobación']),
        etiquetas: toNull(task.Etiquetas),
        descripcion: toNull(task.Descripción),
      };
      return supabaseTask;
    })
    .filter((task): task is SupabaseTask => task !== null);

  if (transformedTasks.length > 0) {
    console.log('[Processor] Muestra de la primera tarea transformada:', transformedTasks[0]);
  }
  
  console.log(`[Processor] Transformación completada. ${transformedTasks.length} tareas son válidas.`);
  return transformedTasks;
};

export const bulkUpsertTasks = async (
  tasks: SupabaseTask[],
  onProgress: (summary: ProcessSummary) => void
): Promise<ProcessSummary> => {
  console.log(`[Supabase] Iniciando upsert masivo de ${tasks.length} tareas.`);
  const summary: ProcessSummary = {
    totalRows: tasks.length,
    processed: 0,
    upserted: 0,
    errors: 0,
  };

  if (tasks.length === 0) {
    console.log('[Supabase] No hay tareas para procesar.');
    onProgress(summary);
    return summary;
  }

  const { count, error } = await supabase.from('juan_marquez').upsert(tasks, {
    onConflict: 'id_tarea',
    count: 'exact',
  });

  if (error) {
    console.error('[Supabase] Error en el upsert masivo:', error);
    summary.errors = tasks.length;
  } else {
    summary.upserted = count || 0;
    console.log(`[Supabase] Upsert exitoso. ${count} filas afectadas.`);
  }
  
  summary.processed = tasks.length;
  onProgress(summary);
  console.log('[Supabase] Resumen final del proceso:', summary);

  return summary;
};
